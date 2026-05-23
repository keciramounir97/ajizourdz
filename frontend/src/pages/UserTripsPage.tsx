import { CalendarDays, Map, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionTitle } from "../components/SectionTitle";
import { useCurrency } from "../contexts/CurrencyContext";
import { getFacilityById } from "../data/catalog";
import { useAppStore } from "../stores/appStore";

export function UserTripsPage() {
  const { bookings, smartPlan } = useAppStore();
  const { format } = useCurrency();

  return (
    <section className="page-shell">
      <SectionTitle eyebrow="Traveler" title="My trips" action={`${bookings.length} bookings`} />
      <div className="role-workspace">
        <article className="material-panel feature-panel">
          <CalendarDays />
          <h2>Upcoming coastal route</h2>
          <p>Bookings, saved activity context, and smart plans are grouped into one trip view.</p>
          <Link className="primary" to="/smart-plan">
            <Sparkles size={18} />
            Open smart plan
          </Link>
        </article>
        <article className="material-panel">
          <h2>Trip timeline</h2>
          <div className="timeline-list">
            {bookings.map((booking) => {
              const facility = getFacilityById(booking.facilityId);
              return (
                <div key={booking.id} className="timeline-item">
                  <span className="timeline-dot" />
                  <div>
                    <strong>{facility?.name ?? booking.facilityId}</strong>
                    <p>{booking.date} · {booking.guests} guests · {format(booking.total)}</p>
                  </div>
                  <span className="pill">{booking.status}</span>
                </div>
              );
            })}
            {smartPlan && (
              <div className="timeline-item">
                <Map />
                <div>
                  <strong>{smartPlan.title}</strong>
                  <p>{smartPlan.days.length} planned days · {format(smartPlan.budget)}</p>
                </div>
                <span className="pill">plan</span>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
