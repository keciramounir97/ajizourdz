import { Sparkles, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SectionTitle } from "../components/SectionTitle";
import { useCurrency } from "../contexts/CurrencyContext";
import { useLocale } from "../contexts/LocaleContext";
import { facilities, getFacilityById } from "../data/catalog";
import {
  makePlanFromReservations,
  makePlanFromSelection,
} from "../data/smartPlan";
import { useAppStore } from "../stores/appStore";

export function ReservationsPage() {
  const navigate = useNavigate();
  const { bookings, cancelBooking, planItems, removePlanItem, setSmartPlan } =
    useAppStore();
  const { format } = useCurrency();
  const { t } = useLocale();

  return (
    <section className="page-shell">
      <div className="comfort-banner">
        <div>
          <strong>Activity context</strong>
          <span>
            Collect hotels, restaurants, and activities like a shopping cart,
            then generate a smart AI plan.
          </span>
        </div>
        <button
          className="primary"
          disabled={planItems.length === 0}
          onClick={() => {
            setSmartPlan(makePlanFromSelection(planItems));
            navigate("/smart-plan");
          }}
        >
          <Sparkles size={18} />
          Generate smart AI plan
        </button>
      </div>
      <div className="reservation-list activity-cart">
        {planItems.length === 0 ? (
          <article className="empty-state">
            <Ticket size={44} />
            <h2>No selected offers yet</h2>
            <p>Add cards from Ou dormir, Ou manger, or Activites a faire.</p>
          </article>
        ) : (
          planItems.map((facilityId) => {
            const facility = facilities.find((item) => item.id === facilityId);
            if (!facility) return null;
            return (
              <article className="reservation-card" key={facility.id}>
                <img src={facility.cover} alt={facility.name} />
                <div>
                  <span className="pill">{facility.providerType}</span>
                  <h3>{facility.name}</h3>
                  <p>
                    {facility.city}, {facility.wilaya}
                  </p>
                </div>
                <div className="reservation-actions">
                  <strong>{format(facility.price)}</strong>
                  <button
                    className="ghost"
                    onClick={() => removePlanItem(facility.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
      <SectionTitle
        eyebrow="Traveler space"
        title={t("nav.reservations")}
        action={`${bookings.length} active`}
      />
      <div className="comfort-banner">
        <strong>Your trip plan starts from your bookings.</strong>
        <span>
          Use your reservation list to build a coherent coastal itinerary and
          keep each booking status easy to scan.
        </span>
        <button
          className="primary"
          disabled={bookings.length === 0}
          onClick={() => {
            setSmartPlan(makePlanFromReservations(bookings));
            navigate("/smart-plan");
          }}
        >
          <Sparkles size={18} />
          Voir mon smart plan
        </button>
      </div>
      {bookings.length === 0 ? (
        <div className="empty-state">
          <Ticket size={44} />
          <h2>{t("reservations.emptyTitle")}</h2>
          <p>{t("reservations.emptyText")}</p>
        </div>
      ) : (
        <div className="reservation-list">
          {bookings.map((booking) => {
            const facility = getFacilityById(booking.facilityId);
            if (!facility) return null;
            return (
              <article key={booking.id} className="reservation-card">
                <img src={facility.cover} alt="" />
                <div>
                  <span className="pill">{booking.status}</span>
                  <h3>{facility.name}</h3>
                  <p>
                    {booking.date} · {booking.guests} guests · {facility.wilaya}
                  </p>
                </div>
                <div className="booking-tracking traveler-tracking">
                  {(booking.tracking ?? ["Request created", "Waiting for provider confirmation"]).map((step) => (
                    <span key={step}>{step}</span>
                  ))}
                </div>
                <div className="reservation-actions">
                  <strong>{format(booking.total)}</strong>
                  {booking.status !== "cancelled" && (
                    <button
                      className="ghost"
                      onClick={() => cancelBooking(booking.id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
