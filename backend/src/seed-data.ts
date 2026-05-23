import { Booking, ContactMessage, CurrencyOption, Facility, User } from "./types.js";

export const coastalWilayas = [
  "Tlemcen",
  "Ain Temouchent",
  "Oran",
  "Mostaganem",
  "Chlef",
  "Tipaza",
  "Alger",
  "Boumerdes",
  "Tizi Ouzou",
  "Bejaia",
  "Jijel",
  "Skikda",
  "Annaba",
  "El Tarf",
];

export const users: User[] = [
  {
    id: "super-1",
    name: "Nadia Platform",
    email: "super@ajizor.dz",
    passwordHash: "super123",
    role: "super_admin",
    providerType: "Platform",
    permissions: ["*"],
  },
  {
    id: "admin-hotel-1",
    name: "Samir Provider",
    email: "hotel@ajizor.dz",
    passwordHash: "admin123",
    role: "admin",
    providerType: "Hotel",
    permissions: ["facilities:write", "bookings:manage"],
  },
  {
    id: "client-1",
    name: "Amira Benali",
    email: "client@ajizor.dz",
    passwordHash: "client123",
    role: "user",
    providerType: "Traveler",
    permissions: ["bookings:create"],
  },
];

export const facilities: Facility[] = [
  {
    id: "hotel-bejaia-1",
    category: "sleep",
    providerType: "Hotel",
    name: "Azur Bejaia Bay Hotel",
    wilaya: "Bejaia",
    city: "Bejaia",
    rating: 8.9,
    reviews: 418,
    price: 14500,
    host: "Yasmine Hotel",
    cover: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["sea view", "breakfast", "family"],
    amenities: ["Wi-Fi", "Parking", "Breakfast", "Sea view"],
    description: "A minimal coastal hotel for families and couples near the Bejaia waterfront.",
  },
  {
    id: "dortoir-jijel-1",
    category: "sleep",
    providerType: "Dortoir",
    name: "Jijel Surfer Dortoir",
    wilaya: "Jijel",
    city: "Ziama Mansouriah",
    rating: 8.2,
    reviews: 122,
    price: 4200,
    host: "Karim Dortoir",
    cover: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["budget", "shared", "young travelers"],
    amenities: ["Shared kitchen", "Lockers", "Laundry"],
    description: "A clean budget dormitory close to beaches and group activities.",
  },
  {
    id: "restaurant-oran-1",
    category: "food",
    providerType: "Restaurant",
    name: "Mers El Kebir Seafood Table",
    wilaya: "Oran",
    city: "Oran",
    rating: 4.7,
    reviews: 286,
    price: 3200,
    host: "Lynda Restaurant",
    cover: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["seafood", "terrace", "local"],
    amenities: ["Terrace", "Family tables", "Card payment"],
    description: "Fresh fish, Algerian coastal flavors, and a terrace made for sunset dinners.",
  },
  {
    id: "activity-tipaza-1",
    category: "activity",
    providerType: "Boat tour",
    name: "Tipaza Roman Coast Boat Tour",
    wilaya: "Tipaza",
    city: "Tipaza",
    rating: 4.8,
    reviews: 194,
    price: 6500,
    host: "Amel Boat Tours",
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["boat", "history", "swim stop"],
    amenities: ["Guide", "Life jackets", "Photo stops"],
    description: "A guided boat experience around the Roman coast with swim and photo stops.",
  },
];

export const bookings: Booking[] = [
  {
    id: "booking-1",
    facilityId: "hotel-bejaia-1",
    userId: "client-1",
    guestName: "Amira Benali",
    date: "2026-06-12",
    guests: 2,
    status: "confirmed",
    total: 29000,
  },
];

export const currencies: CurrencyOption[] = [
  { code: "DZD", label: "Algerian dinar", flag: "DZ", rate: 1 },
  { code: "EUR", label: "Euro", flag: "EU", rate: 147 },
  { code: "USD", label: "US dollar", flag: "US", rate: 135 },
];

export const contacts: ContactMessage[] = [];
