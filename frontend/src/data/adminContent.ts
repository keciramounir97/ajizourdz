import { ContactMessage, Role, SiteSection } from "../types/domain";

export const roleMatrix: Array<{
  role: Role;
  label: string;
  scope: string;
  permissions: string[];
}> = [
  {
    role: "super_admin",
    label: "Super admin",
    scope: "Platform ownership",
    permissions: ["All users", "All roles", "All sections", "Currencies", "Contacts", "Publishing"],
  },
  {
    role: "admin",
    label: "Provider admin",
    scope: "Provider workspace",
    permissions: ["Own offers", "Own bookings", "Moderation queue", "Availability", "Provider content"],
  },
  {
    role: "user",
    label: "Traveler",
    scope: "Traveler account",
    permissions: ["Bookings", "Activity context", "Smart plans", "Profile", "Reviews"],
  },
];

export const siteSections: SiteSection[] = [
  {
    id: "landing",
    title: "Landing page",
    route: "/",
    enabled: true,
    content: "Coastal discovery, trust badges, search, top picks, and provider workflow.",
  },
  {
    id: "sleep",
    title: "Ou dormir",
    route: "/dormir",
    enabled: true,
    content: "Hotels, dortoirs, and cite universitaire listings by coastal wilaya.",
  },
  {
    id: "food",
    title: "Ou manger",
    route: "/manger",
    enabled: true,
    content: "Restaurants and local food tables with booking-ready detail pages.",
  },
  {
    id: "activities",
    title: "Activites a faire",
    route: "/activites",
    enabled: true,
    content: "Boat tours, diving, guides, beach clubs, transport, and entertainment.",
  },
  {
    id: "contact",
    title: "Contact",
    route: "/contact",
    enabled: true,
    content: "Inbound messages and partnership leads sent through SMTP.",
  },
];

export const contactInbox: ContactMessage[] = [
  {
    id: "contact-1",
    name: "Hotel Les Pins",
    email: "partner@example.com",
    subject: "Provider onboarding",
    message: "We want to list rooms and seasonal offers for the Oran coast.",
    status: "new",
  },
  {
    id: "contact-2",
    name: "Tipaza Guide",
    email: "guide@example.com",
    subject: "Activity verification",
    message: "Can Ajizour verify our boat-tour offer and rating badges?",
    status: "resolved",
  },
];

export const newsletterInbox = [
  {
    id: "newsletter-1",
    email: "amira.trips@example.com",
    segment: "Traveler",
    wilayaInterest: "Bejaia",
    source: "Homepage newsletter",
    status: "new",
    subscribedAt: "2026-05-23 10:12",
  },
  {
    id: "newsletter-2",
    email: "oran.food.owner@example.com",
    segment: "Provider",
    wilayaInterest: "Oran",
    source: "Contact page newsletter",
    status: "exported",
    subscribedAt: "2026-05-22 18:40",
  },
  {
    id: "newsletter-3",
    email: "tipaza.activities@example.com",
    segment: "Activity lead",
    wilayaInterest: "Tipaza",
    source: "Landing page footer",
    status: "new",
    subscribedAt: "2026-05-21 14:25",
  },
];

export const reviewSeeds = [
  {
    id: "review-1",
    offer: "Azur Bejaia Bay Hotel",
    rating: 9.1,
    source: "Booking-style",
    text: "Clean, direct sea access, and easy parking for a family weekend.",
  },
  {
    id: "review-2",
    offer: "Mers El Kebir Seafood Table",
    rating: 4.8,
    source: "TripAdvisor-style",
    text: "Strong local seafood menu with a calm terrace and fast service.",
  },
  {
    id: "review-3",
    offer: "Tipaza Roman Coast Boat Tour",
    rating: 4.9,
    source: "Airbnb-style",
    text: "Host was precise, photos were real, and the swim stop was excellent.",
  },
];

export const providerSegments = [
  {
    id: "hotels",
    label: "Hotels",
    owners: 18,
    description: "Hotel owners and managers with rooms, packages, availability, and reservation handling.",
  },
  {
    id: "dortoirs",
    label: "Dortoirs",
    owners: 9,
    description: "Budget dormitory owners with shared rooms, seasonal beds, and youth-travel offers.",
  },
  {
    id: "university-residences",
    label: "Cites universitaires",
    owners: 7,
    description: "University residence managers publishing approved seasonal accommodation capacity.",
  },
  {
    id: "restaurants",
    label: "Restaurants",
    owners: 21,
    description: "Restaurant owners managing menus, tables, local food offers, and booking requests.",
  },
  {
    id: "activity-facilities",
    label: "Activities and clubs",
    owners: 16,
    description: "Clubs, guides, facilities, beach services, boat tours, diving, quad, and entertainment providers.",
  },
];

export const moderationQueue = [
  { id: "mod-1", type: "offer", owner: "Yasmine Hotel", item: "Weekend sea-view package", status: "needs_review", risk: "low" },
  { id: "mod-2", type: "provider", owner: "Tipaza Guide", item: "Boat tour license verification", status: "waiting", risk: "medium" },
  { id: "mod-3", type: "review", owner: "Mers El Kebir Seafood Table", item: "Traveler photo review", status: "new", risk: "low" },
  { id: "mod-4", type: "currency", owner: "Platform", item: "Custom GBP exchange rate", status: "approved", risk: "low" },
];

export const auditEvents = [
  { id: "audit-1", actor: "Nadia Platform", action: "Verified SMTP and MySQL health", time: "Today 10:49", level: "success" },
  { id: "audit-2", actor: "Samir Provider", action: "Created hotel offer draft", time: "Today 09:32", level: "info" },
  { id: "audit-3", actor: "System", action: "Service worker cache refreshed", time: "Yesterday 18:12", level: "info" },
  { id: "audit-4", actor: "Platform", action: "Currency rate edited", time: "Yesterday 14:05", level: "warning" },
];

export const contentTasks = [
  "Refresh homepage hero slides for summer season",
  "Verify all sleep provider categories include hotel, dortoir, and cite universitaire",
  "Review Arabic RTL labels on booking and smart-plan pages",
  "Publish contact response templates for providers",
];
