export type Role = "user" | "admin" | "super_admin";
export type Category = "food" | "sleep" | "activity";
export type BookingStatus = "confirmed" | "pending" | "cancelled";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  providerType: string;
  permissions: string[];
};

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
  userId: string;
  guestName: string;
  date: string;
  guests: number;
  status: BookingStatus;
  total: number;
};

export type CurrencyOption = {
  code: string;
  label: string;
  flag: string;
  rate: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "resolved";
};
