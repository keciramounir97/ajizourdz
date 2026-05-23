import knex, { Knex } from "knex";
import { Model } from "objection";
import { config } from "./config.js";

export const db = knex({
  client: "mysql2",
  connection: {
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
  },
  pool: {
    min: config.database.poolMin,
    max: config.database.poolMax,
  },
});

Model.knex(db);

export async function withTimeout<T>(promise: Promise<T>, ms = 4500): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function checkDatabase() {
  try {
    await withTimeout(db.raw("select 1 as ok"));
    return { ok: true, message: "connected" };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "database check failed" };
  }
}

export async function ensureSchema() {
  const hasUsers = await db.schema.hasTable("users");
  if (!hasUsers) {
    await db.schema.createTable("users", (table) => {
      table.string("id", 80).primary();
      table.string("name").notNullable();
      table.string("email").notNullable().unique();
      table.string("password_hash").notNullable();
      table.enum("role", ["user", "admin", "super_admin"]).notNullable();
      table.string("provider_type").notNullable();
      table.json("permissions").notNullable();
      table.timestamps(true, true);
    });
  }

  const hasFacilities = await db.schema.hasTable("facilities");
  if (!hasFacilities) {
    await db.schema.createTable("facilities", (table) => {
      table.string("id", 80).primary();
      table.enum("category", ["food", "sleep", "activity"]).notNullable().index();
      table.string("provider_type").notNullable();
      table.string("name").notNullable();
      table.string("wilaya").notNullable().index();
      table.string("city").notNullable();
      table.float("rating").notNullable();
      table.integer("reviews").notNullable();
      table.integer("price").notNullable().index();
      table.string("host").notNullable();
      table.text("cover").notNullable();
      table.json("gallery").notNullable();
      table.json("tags").notNullable();
      table.json("amenities").notNullable();
      table.text("description").notNullable();
      table.timestamps(true, true);
    });
  }

  const hasBookings = await db.schema.hasTable("bookings");
  if (!hasBookings) {
    await db.schema.createTable("bookings", (table) => {
      table.string("id", 80).primary();
      table.string("facility_id", 80).notNullable().index();
      table.string("user_id", 80).notNullable().index();
      table.string("guest_name").notNullable();
      table.date("date").notNullable();
      table.integer("guests").notNullable();
      table.enum("status", ["confirmed", "pending", "cancelled"]).notNullable().index();
      table.integer("total").notNullable();
      table.timestamps(true, true);
    });
  }

  const hasSmartPlans = await db.schema.hasTable("smart_plans");
  if (!hasSmartPlans) {
    await db.schema.createTable("smart_plans", (table) => {
      table.string("id", 80).primary();
      table.string("user_id", 80).notNullable().index();
      table.string("title").notNullable();
      table.string("mood").notNullable();
      table.string("wilaya").notNullable().index();
      table.integer("budget").notNullable();
      table.json("days").notNullable();
      table.timestamps(true, true);
    });
  }

  const hasCurrencies = await db.schema.hasTable("currencies");
  if (!hasCurrencies) {
    await db.schema.createTable("currencies", (table) => {
      table.string("code", 12).primary();
      table.string("label").notNullable();
      table.string("flag").notNullable();
      table.float("rate").notNullable();
      table.timestamps(true, true);
    });
  }

  const hasContacts = await db.schema.hasTable("contacts");
  if (!hasContacts) {
    await db.schema.createTable("contacts", (table) => {
      table.string("id", 80).primary();
      table.string("name").notNullable();
      table.string("email").notNullable();
      table.string("subject").notNullable();
      table.text("message").notNullable();
      table.enum("status", ["new", "resolved"]).notNullable().index();
      table.timestamps(true, true);
    });
  }

  const hasActivityContext = await db.schema.hasTable("activity_context");
  if (!hasActivityContext) {
    await db.schema.createTable("activity_context", (table) => {
      table.string("id", 80).primary();
      table.string("user_id", 80).notNullable().index();
      table.string("facility_id", 80).notNullable();
      table.timestamps(true, true);
      table.unique(["user_id", "facility_id"]);
    });
  }
}

export async function tryEnsureSchema() {
  try {
    await withTimeout(ensureSchema(), 12000);
    return { ok: true, message: "migrations ready" };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "migration failed" };
  }
}

export async function destroyDb() {
  await db.destroy();
}

export type Transaction = Knex.Transaction;
