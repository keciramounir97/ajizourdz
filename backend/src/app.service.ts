import bcrypt from "bcryptjs";
import { Injectable } from "@nestjs/common";
import jwt from "jsonwebtoken";
import { type StringValue } from "ms";
import { randomUUID } from "node:crypto";
import { cache } from "./cache.js";
import { config } from "./config.js";
import { checkDatabase, db, tryEnsureSchema, withTimeout } from "./db.js";
import { checkEmail, sendEmail } from "./email.js";
import { bookings, contacts, currencies, facilities, users } from "./seed-data.js";
import { generateSmartPlan } from "./ai.js";
import { Booking, BookingStatus, Category, ContactMessage, CurrencyOption, Facility, Role, User } from "./types.js";

@Injectable()
export class AppService {
  private readonly activityContext = new Map<string, Set<string>>();
  private readonly resetTokens = new Map<string, { userId: string; expiresAt: number }>();

  async health() {
    const [database, email] = await Promise.all([checkDatabase(), checkEmail()]);
    return {
      app: config.appName,
      version: config.version,
      environment: config.nodeEnv,
      uptimeSeconds: Math.round(process.uptime()),
      server: { host: config.host, port: config.port },
      database: {
        host: config.database.host,
        port: config.database.port,
        name: config.database.name,
        user: config.database.user,
        pool: { min: config.database.poolMin, max: config.database.poolMax },
        ...database,
      },
      cache: cache.stats(),
      email: {
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
        user: config.smtp.user,
        configured: Boolean(config.smtp.host && config.smtp.user),
        ...email,
      },
      ai: {
        nvidia: Boolean(config.ai.nvidiaKey),
        fallback: Boolean(config.ai.fallbackKey && config.ai.fallbackBaseUrl),
      },
      modules: ["auth", "catalog", "bookings", "activity-context", "smart-plans", "admin", "contact", "currencies"],
    };
  }

  async readinessLog() {
    const migration = await tryEnsureSchema();
    const health = await this.health();
    return { migration, seed: await this.seedDatabase(), health };
  }

  async seedDatabase() {
    try {
      if (!(await this.dbAvailable())) return { ok: false, message: "database unavailable; using in-memory seed data" };
      await withTimeout(
        Promise.all([
          this.upsertMany("users", users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            password_hash: user.passwordHash,
            role: user.role,
            provider_type: user.providerType,
            permissions: JSON.stringify(user.permissions),
          }))),
          this.upsertMany("facilities", facilities.map((facility) => ({
            id: facility.id,
            category: facility.category,
            provider_type: facility.providerType,
            name: facility.name,
            wilaya: facility.wilaya,
            city: facility.city,
            rating: facility.rating,
            reviews: facility.reviews,
            price: facility.price,
            host: facility.host,
            cover: facility.cover,
            gallery: JSON.stringify(facility.gallery),
            tags: JSON.stringify(facility.tags),
            amenities: JSON.stringify(facility.amenities),
            description: facility.description,
          }))),
          this.upsertMany("currencies", currencies),
        ]),
        12000,
      );
      return { ok: true, message: "seed data ready" };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "seed failed" };
    }
  }

  async signup(body: { name: string; email: string; password: string }) {
    if (!body.email || !body.password || !body.name) throw new Error("name, email and password are required");
    const existing = await this.findUserByEmail(body.email);
    if (existing) throw new Error("Email already exists");
    const user: User = {
      id: `user-${randomUUID()}`,
      name: body.name,
      email: body.email,
      passwordHash: await bcrypt.hash(body.password, 10),
      role: "user",
      providerType: "Traveler",
      permissions: ["bookings:create"],
    };
    users.unshift(user);
    await sendEmail(user.email, "Welcome to Ajizour", `Welcome ${user.name}, your Ajizour account is ready.`);
    return this.session(user);
  }

  async login(body: { email: string; password: string }) {
    const user = await this.findUserByEmail(body.email);
    if (!user) throw new Error("Invalid email or password");
    const ok = user.passwordHash.startsWith("$2")
      ? await bcrypt.compare(body.password, user.passwordHash)
      : body.password === user.passwordHash;
    if (!ok) throw new Error("Invalid email or password");
    return this.session(user);
  }

  async resetPassword(body: { email: string }) {
    const user = await this.findUserByEmail(body.email);
    if (!user) return { ok: true, message: "If the email exists, a reset link was sent." };
    const token = randomUUID();
    this.resetTokens.set(token, { userId: user.id, expiresAt: Date.now() + 1000 * 60 * 30 });
    await sendEmail(user.email, "Ajizour password reset", `Use this reset token in the app: ${token.slice(0, 8)}...`);
    return { ok: true, message: "If the email exists, a reset link was sent.", resetTokenPreview: token.slice(0, 8) };
  }

  async confirmResetPassword(body: { token: string; password: string }) {
    const token = this.resetTokens.get(body.token);
    if (!token || token.expiresAt < Date.now()) throw new Error("Invalid or expired reset token");
    const user = users.find((item) => item.id === token.userId);
    if (!user) throw new Error("User not found");
    user.passwordHash = await bcrypt.hash(body.password, 10);
    this.resetTokens.delete(body.token);
    return { ok: true };
  }

  listFacilities(query: { category?: Category; wilaya?: string; budget?: string; providerType?: string; q?: string; sort?: string }) {
    const key = `facilities:${JSON.stringify(query)}`;
    const cached = cache.get<Facility[]>(key);
    if (cached) return cached;
    const maxBudget = query.budget ? Number(query.budget) : undefined;
    const normalized = query.q?.trim().toLowerCase();
    const result = facilities
      .filter((facility) => {
        const searchable = [
          facility.name,
          facility.wilaya,
          facility.city,
          facility.host,
          facility.providerType,
          ...facility.tags,
          ...facility.amenities,
        ].join(" ").toLowerCase();
        if (query.category && facility.category !== query.category) return false;
        if (query.wilaya && query.wilaya !== "All" && facility.wilaya !== query.wilaya) return false;
        if (query.providerType && query.providerType !== "All" && facility.providerType !== query.providerType) return false;
        if (maxBudget && facility.price > maxBudget) return false;
        if (normalized && !searchable.includes(normalized)) return false;
        return true;
      })
      .sort((a, b) => {
        if (query.sort === "price-low") return a.price - b.price;
        if (query.sort === "price-high") return b.price - a.price;
        if (query.sort === "rating") return b.rating - a.rating;
        return b.reviews - a.reviews;
      });
    cache.set(key, result, 60_000);
    return result;
  }

  getFacility(id: string) {
    const facility = facilities.find((item) => item.id === id);
    if (!facility) throw new Error("Facility not found");
    return facility;
  }

  listBookings(userId = "client-1") {
    return bookings.filter((booking) => booking.userId === userId || userId === "super-1");
  }

  createBooking(body: Partial<Booking>) {
    const facility = this.getFacility(String(body.facilityId));
    const booking: Booking = {
      id: `booking-${randomUUID()}`,
      facilityId: facility.id,
      userId: body.userId ?? "client-1",
      guestName: body.guestName ?? "Ajizour traveler",
      date: body.date ?? new Date().toISOString().slice(0, 10),
      guests: Number(body.guests ?? 1),
      status: "pending",
      total: Number(body.total ?? facility.price),
    };
    bookings.unshift(booking);
    void sendEmail(config.smtp.from, "New Ajizour booking", `${booking.guestName} booked ${facility.name}.`);
    return booking;
  }

  updateBookingStatus(id: string, status: BookingStatus) {
    const booking = bookings.find((item) => item.id === id);
    if (!booking) throw new Error("Booking not found");
    booking.status = status;
    return booking;
  }

  getActivityContext(userId = "client-1") {
    const ids = Array.from(this.activityContext.get(userId) ?? []);
    return ids.map((id) => facilities.find((facility) => facility.id === id)).filter(Boolean);
  }

  addActivityContext(userId = "client-1", facilityId: string) {
    this.getFacility(facilityId);
    const set = this.activityContext.get(userId) ?? new Set<string>();
    set.add(facilityId);
    this.activityContext.set(userId, set);
    return this.getActivityContext(userId);
  }

  removeActivityContext(userId = "client-1", facilityId: string) {
    this.activityContext.get(userId)?.delete(facilityId);
    return this.getActivityContext(userId);
  }

  async generatePlan(body: { source?: string; persons?: number; budget?: number; wilaya?: string; currency?: string; selectedIds?: string[] }) {
    const selectedFacilities = (body.selectedIds ?? [])
      .map((id) => facilities.find((facility) => facility.id === id))
      .filter(Boolean) as Facility[];
    return generateSmartPlan({
      source: body.source,
      persons: Number(body.persons ?? 2),
      budget: body.budget ? Number(body.budget) : undefined,
      wilaya: body.wilaya,
      currency: body.currency,
      facilities,
      selectedFacilities,
      bookings,
    });
  }

  listCurrencies() {
    return currencies;
  }

  upsertCurrency(option: CurrencyOption) {
    const normalized = { ...option, code: option.code.toUpperCase(), rate: Number(option.rate || 1) };
    const index = currencies.findIndex((item) => item.code === normalized.code);
    if (index >= 0) currencies[index] = normalized;
    else currencies.push(normalized);
    cache.deletePrefix("currencies");
    return normalized;
  }

  createContact(body: Omit<ContactMessage, "id" | "status">) {
    const contact: ContactMessage = { id: `contact-${randomUUID()}`, status: "new", ...body };
    contacts.unshift(contact);
    void sendEmail(config.smtp.from, `Ajizour contact: ${contact.subject}`, `${contact.name} <${contact.email}>\n\n${contact.message}`);
    return contact;
  }

  adminSummary() {
    return {
      users,
      contacts,
      facilities,
      bookings,
      currencies,
      sections: [
        { id: "home", title: "Home", route: "/", enabled: true },
        { id: "contact", title: "Contact", route: "/contact", enabled: true },
      ],
      permissions: ["users:manage", "roles:manage", "facilities:write", "sections:write", "contacts:manage"],
    };
  }

  private session(user: User) {
    const safeUser = this.safeUser(user);
    return {
      user: safeUser,
      token: jwt.sign(safeUser, config.jwtSecret, { expiresIn: config.jwtExpiresIn as StringValue }),
      refreshToken: jwt.sign({ sub: user.id, type: "refresh" }, config.jwtSecret, { expiresIn: config.jwtRefreshExpiresIn as StringValue }),
    };
  }

  private safeUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      providerType: user.providerType,
      permissions: user.permissions,
    };
  }

  private async findUserByEmail(email: string) {
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  }

  private async dbAvailable() {
    const status = await checkDatabase();
    return status.ok;
  }

  private async upsertMany(table: string, rows: Record<string, unknown>[]) {
    if (!rows.length) return;
    await db(table).insert(rows).onConflict().merge();
  }
}
