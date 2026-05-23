import {
  CalendarCheck,
  ChevronLeft,
  Clock3,
  Heart,
  MapPin,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { BookingModal } from "../components/BookingModal";
import { useCurrency } from "../contexts/CurrencyContext";
import { useLocale } from "../contexts/LocaleContext";
import { getFacilityById } from "../data/catalog";
import { useAppStore } from "../stores/appStore";

export function FacilityProfilePage() {
  const { id } = useParams();
  const facility = getFacilityById(id);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { addPlanItem, planItems } = useAppStore();
  const { format } = useCurrency();
  const { t } = useLocale();

  if (!facility) return <Navigate to="/" replace />;

  const selected = planItems.includes(facility.id);
  const detail = offerDetailCopy(facility.category, facility.providerType, t);

  return (
    <section className="page-shell offer-details-page">
      <Link className="back-button" to={categoryPath(facility.category)}>
        <ChevronLeft size={18} /> {t("facility.back")}
      </Link>

      <div className="profile-hero offer-hero-panel">
        <div>
          <div className="offer-kicker-row">
            <span className="pill">{facility.providerType}</span>
            <span className="pill">{detail.marketLabel}</span>
          </div>
          <h1>{facility.name}</h1>
          <p>
            <MapPin size={17} /> {facility.city}, {facility.wilaya} · {t("facility.hostedBy")} {facility.host}
          </p>
          <div className="profile-score">
            <strong>{facility.rating}</strong>
            <span>{t("facility.excellent")} · {facility.reviews} {t("facility.travelerReviews")}</span>
          </div>
          <div className="rating-badges">
            <span>
              <ShieldCheck size={16} /> {t("facility.bookingStyle")} {Math.min(9.6, facility.rating + 0.2).toFixed(1)}
            </span>
            <span>
              <Star size={16} fill="currentColor" /> {t("facility.tripAdvisorStyle")} {facility.rating.toFixed(1)}
            </span>
            <span>
              <Heart size={16} /> {t("facility.airbnbStyle")}
            </span>
          </div>
        </div>
        <div className="profile-booker">
          <span>{t("facility.from")}</span>
          <strong>{format(facility.price)}</strong>
          <small>{detail.priceUnit}</small>
          <button onClick={() => setBookingOpen(true)}>{t("facility.book")}</button>
          <button className="ghost" onClick={() => addPlanItem(facility.id)} disabled={selected}>
            <Plus size={16} />
            {selected ? t("facility.added") : t("facility.addContext")}
          </button>
        </div>
      </div>

      <div className="gallery">
        {[facility.cover, ...facility.gallery].map((image) => (
          <img src={image} alt="" key={image} />
        ))}
      </div>

      <div className="profile-grid">
        <article className="offer-details-main">
          <h2>{t("facility.profile")}</h2>
          <p>{facility.description}</p>
          <div className="offer-summary-strip">
            {detail.summary.map((item) => (
              <span key={item}>
                <ShieldCheck size={16} />
                {item}
              </span>
            ))}
          </div>
          <div className="profile-facts">
            <span>
              <strong>{facility.wilaya}</strong>
              {t("facility.wilaya")}
            </span>
            <span>
              <strong>{facility.providerType}</strong>
              {t("facility.providerType")}
            </span>
            <span>
              <strong>{format(facility.price)}</strong>
              {t("facility.startingPrice")}
            </span>
          </div>
          <div className="tag-row large">
            {facility.amenities.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <section className="offer-detail-section">
            <h2>{t("facility.offerDetails")}</h2>
            <div className="offer-detail-grid">
              <article>
                <CalendarCheck />
                <strong>{detail.duration}</strong>
                <p>{detail.durationText}</p>
              </article>
              <article>
                <Users />
                <strong>{detail.capacity}</strong>
                <p>{detail.capacityText}</p>
              </article>
              <article>
                <Clock3 />
                <strong>{detail.confirmation}</strong>
                <p>{t("facility.confirmationText")}</p>
              </article>
            </div>
          </section>

          <section className="offer-detail-section">
            <h2>{t("facility.bookingPolicy")}</h2>
            <div className="policy-grid">
              {detail.policies.map((policy) => (
                <span key={policy}>{policy}</span>
              ))}
            </div>
          </section>
        </article>

        <aside className="owner-panel offer-owner-panel">
          <Store />
          <strong>{facility.host}</strong>
          <span>
            {t("facility.ownerText")}
          </span>
          <div className="owner-tracking-box">
            <strong>{t("facility.trackingFlow")}</strong>
            <span>{t("tracking.pending")}</span>
            <span>{t("tracking.providerReview")}</span>
            <span>{t("tracking.finalState")}</span>
            <span>{t("tracking.notified")}</span>
          </div>
          <Link className="primary" to="/smart-plan">
            <Sparkles size={18} />
            {t("smart.generate")}
          </Link>
        </aside>
      </div>

      {bookingOpen && <BookingModal facility={facility} onClose={() => setBookingOpen(false)} />}
    </section>
  );
}

function categoryPath(category: string) {
  if (category === "food") return "/manger";
  if (category === "sleep") return "/dormir";
  return "/activites";
}

function offerDetailCopy(category: string, providerType: string, t: (key: string) => string) {
  if (category === "sleep") {
    return {
      marketLabel: providerType === "Dortoir" ? t("detail.sleepBudget") : providerType.toLowerCase().includes("universitaire") ? t("detail.sleepResidence") : t("detail.sleepOffer"),
      priceUnit: t("detail.sleepPriceUnit"),
      duration: t("detail.sleepDuration"),
      durationText: t("detail.sleepDurationText"),
      capacity: t("detail.sleepCapacity"),
      capacityText: t("detail.sleepCapacityText"),
      confirmation: t("detail.sleepConfirmation"),
      summary: [t("detail.sleepSummary1"), t("detail.sleepSummary2"), t("detail.sleepSummary3")],
      policies: [t("detail.sleepPolicy1"), t("detail.sleepPolicy2"), t("detail.sleepPolicy3")],
    };
  }
  if (category === "food") {
    return {
      marketLabel: t("detail.foodOffer"),
      priceUnit: t("detail.foodPriceUnit"),
      duration: t("detail.foodDuration"),
      durationText: t("detail.foodDurationText"),
      capacity: t("detail.foodCapacity"),
      capacityText: t("detail.foodCapacityText"),
      confirmation: t("detail.foodConfirmation"),
      summary: [t("detail.foodSummary1"), t("detail.foodSummary2"), t("detail.foodSummary3")],
      policies: [t("detail.foodPolicy1"), t("detail.foodPolicy2"), t("detail.foodPolicy3")],
    };
  }
  return {
    marketLabel: t("detail.activityOffer"),
    priceUnit: t("detail.activityPriceUnit"),
    duration: t("detail.activityDuration"),
    durationText: t("detail.activityDurationText"),
    capacity: t("detail.activityCapacity"),
    capacityText: t("detail.activityCapacityText"),
    confirmation: t("detail.activityConfirmation"),
    summary: [t("detail.activitySummary1"), t("detail.activitySummary2"), t("detail.activitySummary3")],
    policies: [t("detail.activityPolicy1"), t("detail.activityPolicy2"), t("detail.activityPolicy3")],
  };
}
