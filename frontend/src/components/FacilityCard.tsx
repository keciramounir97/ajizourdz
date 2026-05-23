import { Eye, MapPin, Plus, Star, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "../contexts/CurrencyContext";
import { useLocale } from "../contexts/LocaleContext";
import { useAppStore } from "../stores/appStore";
import { Facility } from "../types/domain";

export function FacilityCard({
  facility,
  wide,
}: {
  facility: Facility;
  wide?: boolean;
}) {
  const { format } = useCurrency();
  const { t } = useLocale();
  const { planItems, togglePlanItem } = useAppStore();
  const selected = planItems.includes(facility.id);

  return (
    <article className={wide ? "facility-card wide" : "facility-card"}>
      <img src={facility.cover} alt={facility.name} />
      <div>
        <div className="card-head">
          <span className="pill">{facility.providerType}</span>
          <span className="rating">
            <Star size={15} fill="currentColor" /> {facility.rating}
          </span>
        </div>
        <h3>{facility.name}</h3>
        <p>
          <MapPin size={15} /> {facility.city}, {facility.wilaya} · {facility.reviews}{" "}
          {t("facility.reviews")}
        </p>
        <div className="tag-row">
          {facility.tags.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="card-foot">
          <strong>{format(facility.price)}</strong>
          <button
            className={selected ? "icon-text-button selected" : "icon-text-button"}
            onClick={() => togglePlanItem(facility.id)}
          >
            {selected ? <X size={16} /> : <Plus size={16} />}
            {selected ? t("facility.removePlan") : t("facility.addPlan")}
          </button>
          <Link to={`/facility/${facility.id}`}>
            <Eye size={16} />
            {t("card.details")}
          </Link>
        </div>
      </div>
    </article>
  );
}
