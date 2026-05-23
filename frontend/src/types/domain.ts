export type Role = "user" | "admin" | "super_admin";
export type Category = "food" | "sleep" | "activity";
export type Currency = string;
export type Locale = "fr" | "en" | "ar";
export type BookingStatus = "confirmed" | "pending" | "cancelled";

export type Facility = {
  id: string;
  category: Category;
  providerType: string;
  name: string;
  wilaya: string;
  city: string;
  rating: number;
  reviews: number;
  price: number;
  host: string;
  cover: string;
  gallery: string[];
  tags: string[];
  amenities: string[];
  description: string;
};

export type Booking = {
  id: string;
  facilityId: string;
  date: string;
  guests: number;
  status: BookingStatus;
  total: number;
  guestName?: string;
  providerNote?: string;
  tracking?: string[];
};

export type SmartPlan = {
  title: string;
  days: string[];
  budget: number;
  mood: string;
  wilaya: string;
};

export type Account = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  providerType: string;
  permissions?: string[];
};

export type CurrencyOption = {
  code: Currency;
  label: string;
  flag: string;
  rate: number;
};

export type SiteSection = {
  id: string;
  title: string;
  route: string;
  enabled: boolean;
  content: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "resolved";
};

export type ProviderStats = {
  grossBookings: string;
  activeOffers: number;
  requests: number;
  users: number;
  moderation: number;
};

export type AdminRequest = {
  id: string;
  facilityId: string;
  guest: string;
  type: "booking" | "offer_review" | "support";
  date: string;
  status: "new" | "approved" | "waiting" | "resolved";
  amount: number;
};

export type AdminOffer = {
  id: string;
  title: string;
  category: Category;
  wilaya: string;
  price: number;
  status: "published" | "draft" | "needs_review";
};
