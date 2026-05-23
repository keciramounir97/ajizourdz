import {
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Plus,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { Metric } from "../components/Metric";
import { SectionTitle } from "../components/SectionTitle";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { adminOffers, adminRequests, facilities, providerStats } from "../data/catalog";
import { useAppStore } from "../stores/appStore";
import { AdminOffer, Category } from "../types/domain";

export function AdminPanelPage() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const { bookings, updateBookingStatus } = useAppStore();
  const [offers, setOffers] = useState(adminOffers);
  const [title, setTitle] = useState("Cozy beach weekend package");
  const [category, setCategory] = useState<Category>("sleep");
  const [wilaya, setWilaya] = useState("Bejaia");
  const [price, setPrice] = useState(12000);

  if (!user) return null;
  const currentUser = user;

  const stats = providerStats[currentUser.role];
  const visibleRequests =
    currentUser.role === "super_admin"
      ? adminRequests
      : adminRequests.filter((request) => {
          const facility = facilities.find((item) => item.id === request.facilityId);
          return facility?.providerType === currentUser.providerType;
        });
  const liveBookings =
    currentUser.role === "super_admin"
      ? bookings
      : bookings.filter((booking) => {
          const facility = facilities.find((item) => item.id === booking.facilityId);
          return facility?.providerType === currentUser.providerType;
        });

  function submitOffer(event: FormEvent) {
    event.preventDefault();
    const offer: AdminOffer = {
      id: `offer-${Date.now()}`,
      title,
      category,
      wilaya,
      price,
      status: currentUser.role === "super_admin" ? "published" : "needs_review",
    };
    setOffers((current) => [offer, ...current]);
  }

  return (
    <section className="page-shell admin-page">
      <SectionTitle
        eyebrow={currentUser.role === "super_admin" ? "Platform command" : "Provider workspace"}
        title={currentUser.role === "super_admin" ? "Super admin panel" : `${currentUser.providerType} admin panel`}
        action={currentUser.name}
      />

      <div className="dashboard-grid">
        <Metric icon={<CircleDollarSign />} label="Gross bookings" value={stats.grossBookings} />
        <Metric icon={<Store />} label="Active offers" value={`${stats.activeOffers}`} />
        <Metric icon={<CalendarClock />} label="Open requests" value={`${stats.requests}`} />
        <Metric
          icon={user.role === "super_admin" ? <Users /> : <CheckCircle2 />}
          label={currentUser.role === "super_admin" ? "Platform users" : "Approval rate"}
          value={currentUser.role === "super_admin" ? `${stats.users}` : "94%"}
        />
      </div>

      <div className="admin-layout">
        <form className="admin-form" onSubmit={submitOffer}>
          <h2>
            <Plus size={20} /> Create offer
          </h2>
          <label>
            Offer title
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value as Category)}>
              <option value="sleep">Sleep</option>
              <option value="food">Food</option>
              <option value="activity">Activity</option>
            </select>
          </label>
          <label>
            Wilaya
            <input value={wilaya} onChange={(event) => setWilaya(event.target.value)} />
          </label>
          <label>
            Price in DZD
            <input
              type="number"
              min={1}
              value={price}
              onChange={(event) => setPrice(Number(event.target.value))}
            />
          </label>
          <button className="primary">Publish offer</button>
        </form>

        <article className="admin-table-panel">
          <h2>
            <ClipboardList size={20} /> Reservation and moderation queue
          </h2>
          <div className="admin-table">
            {visibleRequests.map((request) => {
              const facility = facilities.find((item) => item.id === request.facilityId);
              return (
                <div key={request.id} className="admin-row">
                  <span className="pill">{request.status}</span>
                  <strong>{facility?.name ?? request.facilityId}</strong>
                  <span>{request.guest}</span>
                  <span>{request.date}</span>
                  <b>{format(request.amount)}</b>
                </div>
              );
            })}
          </div>
        </article>
      </div>

      <article className="admin-table-panel">
        <h2>
          <ShieldCheck size={20} /> Offer inventory
        </h2>
        <div className="offer-grid">
          {offers.map((offer) => (
            <div className="offer-card" key={offer.id}>
              <span className="pill">{offer.status}</span>
              <h3>{offer.title}</h3>
              <p>
                {offer.category} · {offer.wilaya}
              </p>
              <strong>{format(offer.price)}</strong>
            </div>
          ))}
        </div>
      </article>

      <article className="admin-table-panel">
        <h2>
          <CalendarClock size={20} /> Live reservations
        </h2>
        <div className="admin-table">
          {liveBookings.length === 0 ? (
            <p className="muted-text">No live reservations for this provider yet.</p>
          ) : (
            liveBookings.map((booking) => {
              const facility = facilities.find((item) => item.id === booking.facilityId);
              return (
                <div key={booking.id} className="admin-row live-booking-row">
                  <span className="pill">{booking.status}</span>
                  <strong>{facility?.name ?? booking.facilityId}</strong>
                  <span>{booking.guests} guests</span>
                  <span>{booking.date}</span>
                  <b>{format(booking.total)}</b>
                  <div className="admin-actions">
                    <button onClick={() => updateBookingStatus(booking.id, "confirmed")}>
                      Confirm
                    </button>
                    <button onClick={() => updateBookingStatus(booking.id, "cancelled")}>
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </article>
    </section>
  );
}
