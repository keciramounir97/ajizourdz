import { create } from "zustand";
import { persist } from "zustand/middleware";
import seedBookings from "../mock/bookings.json";
import { Booking, BookingStatus, Role, SmartPlan } from "../types/domain";

export const managedPages = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/profile", label: "Profile" },
  { path: "/settings", label: "Settings" },
  { path: "/reservations", label: "Reservations" },
  { path: "/activity-context", label: "Activity context" },
  { path: "/smart-plan", label: "Smart plan" },
  { path: "/my-trips", label: "My trips" },
  { path: "/reviews", label: "Reviews" },
  { path: "/support", label: "Support" },
  { path: "/admin", label: "Admin dashboard" },
  { path: "/admin/users", label: "All users" },
  { path: "/admin/clients", label: "Clients" },
  { path: "/admin/partners", label: "Partners" },
  { path: "/admin/providers", label: "Provider registry" },
  { path: "/admin/offers", label: "Offers" },
  { path: "/admin/bookings", label: "Booking management" },
  { path: "/admin/currencies", label: "Currencies" },
  { path: "/admin/sections", label: "Website sections" },
  { path: "/admin/contacts", label: "Contacts" },
  { path: "/admin/audit", label: "Audit" },
  { path: "/super-admin", label: "Super admin" },
] as const;

const defaultPageAccess: Record<string, Role[]> = Object.fromEntries(
  managedPages.map((page) => {
    if (page.path.startsWith("/super-admin")) return [page.path, ["super_admin"]];
    if (page.path.startsWith("/admin")) return [page.path, ["admin", "super_admin"]];
    return [page.path, ["user", "admin", "super_admin"]];
  }),
) as Record<string, Role[]>;

type AppStore = {
  bookings: Booking[];
  planItems: string[];
  smartPlan?: SmartPlan;
  mobileMenu: boolean;
  pageAccess: Record<string, Role[]>;
  addBooking: (booking: Omit<Booking, "id">) => void;
  addPlanItem: (facilityId: string) => void;
  removePlanItem: (facilityId: string) => void;
  togglePlanItem: (facilityId: string) => void;
  setPageRoleAccess: (path: string, role: Role, enabled: boolean) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  cancelBooking: (bookingId: string) => void;
  setSmartPlan: (plan: SmartPlan) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      bookings: seedBookings as Booking[],
      planItems: [],
      smartPlan: undefined,
      mobileMenu: false,
      pageAccess: defaultPageAccess,
      addBooking: (booking) =>
        set((state) => ({
          bookings: [
            {
              ...booking,
              id: `booking-${Date.now()}`,
              tracking: [
                "Request created",
                booking.status === "pending" ? "Waiting for provider confirmation" : `Status set to ${booking.status}`,
              ],
            },
            ...state.bookings,
          ],
        })),
      addPlanItem: (facilityId) =>
        set((state) => ({
          planItems: state.planItems.includes(facilityId)
            ? state.planItems
            : [facilityId, ...state.planItems],
        })),
      removePlanItem: (facilityId) =>
        set((state) => ({
          planItems: state.planItems.filter((id) => id !== facilityId),
        })),
      togglePlanItem: (facilityId) =>
        set((state) => ({
          planItems: state.planItems.includes(facilityId)
            ? state.planItems.filter((id) => id !== facilityId)
            : [facilityId, ...state.planItems],
        })),
      setPageRoleAccess: (path, role, enabled) =>
        set((state) => {
          const current = state.pageAccess[path] ?? [];
          const next = enabled
            ? Array.from(new Set([...current, role]))
            : current.filter((item) => item !== role);
          return {
            pageAccess: {
              ...state.pageAccess,
              [path]: next,
            },
          };
        }),
      updateBookingStatus: (bookingId, status) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? {
                  ...booking,
                  status,
                  tracking: [
                    ...(booking.tracking ?? ["Request created"]),
                    status === "confirmed"
                      ? "Provider confirmed the booking"
                      : status === "cancelled"
                        ? "Booking was cancelled"
                        : "Booking returned to pending review",
                  ],
                }
              : booking,
          ),
        })),
      cancelBooking: (bookingId) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "cancelled" }
              : booking,
          ),
        })),
      setSmartPlan: (smartPlan) => set({ smartPlan }),
      toggleMobileMenu: () =>
        set((state) => ({ mobileMenu: !state.mobileMenu })),
      closeMobileMenu: () => set({ mobileMenu: false }),
    }),
    {
      name: "ajizor-app-store",
      partialize: (state) => ({
        bookings: state.bookings,
        planItems: state.planItems,
        smartPlan: state.smartPlan,
        pageAccess: state.pageAccess,
      }),
      merge: (persisted, current) => {
        const data = persisted as Partial<AppStore> | undefined;
        return {
          ...current,
          ...data,
          pageAccess: { ...defaultPageAccess, ...(data?.pageAccess ?? {}) },
        };
      },
    },
  ),
);
