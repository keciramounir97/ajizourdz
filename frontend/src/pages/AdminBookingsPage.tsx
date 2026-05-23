import { CalendarClock } from "lucide-react";
import { SectionTitle } from "../components/SectionTitle";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { facilities } from "../data/catalog";
import { useAppStore } from "../stores/appStore";

export function AdminBookingsPage() {
  const { user } = useAuth();
  const { bookings, updateBookingStatus } = useAppStore();
  const { format } = useCurrency();
  const visibleBookings =
    user?.role === "super_admin"
      ? bookings
      : bookings.filter((booking) => {
          const facility = facilities.find((item) => item.id === booking.facilityId);
          return facility?.providerType === user?.providerType;
        });

  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow={user?.role === "super_admin" ? "Super admin" : `${user?.providerType} admin`}
        title="Booking management and tracking"
        action={`${visibleBookings.length} concerned reservations`}
      />
      <div className="booking-status-board">
        {["pending", "confirmed", "cancelled"].map((status) => (
          <article className="material-panel" key={status}>
            <span className="pill">{status}</span>
            <strong>{visibleBookings.filter((booking) => booking.status === status).length}</strong>
            <p>{status === "pending" ? "Needs owner or manager action" : status === "confirmed" ? "Traveler can prepare trip" : "Closed or cancelled requests"}</p>
          </article>
        ))}
      </div>
      <article className="material-panel">
        <h2>
          <CalendarClock size={20} /> Reservation command table
        </h2>
        <div className="admin-table">
          {visibleBookings.map((booking) => {
            const facility = facilities.find((item) => item.id === booking.facilityId);
            const owner = facility?.host ?? "Platform";
            return (
              <div key={booking.id} className="booking-management-card">
                <div className="booking-management-main">
                  <span className="pill">{booking.status}</span>
                  <strong>{facility?.name ?? booking.facilityId}</strong>
                  <span>{facility?.providerType} · concerned role: {owner}</span>
                  <span>{booking.guestName ?? "Traveler"} · {booking.guests} guests · {booking.date}</span>
                  <b>{format(booking.total)}</b>
                </div>
                <div className="booking-tracking">
                  {(booking.tracking ?? ["Request created", "Waiting for provider confirmation"]).map((step) => (
                    <span key={step}>{step}</span>
                  ))}
                </div>
                <div className="admin-actions">
                  <button onClick={() => updateBookingStatus(booking.id, "confirmed")}>Confirm</button>
                  <button onClick={() => updateBookingStatus(booking.id, "pending")}>Pending</button>
                  <button onClick={() => updateBookingStatus(booking.id, "cancelled")}>Cancel</button>
                </div>
              </div>
            );
          })}
          {visibleBookings.length === 0 && (
            <p className="muted-text">No booking requests are assigned to this provider role yet.</p>
          )}
        </div>
      </article>
    </section>
  );
}
