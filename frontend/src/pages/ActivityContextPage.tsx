import { Sparkles, Ticket, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SectionTitle } from "../components/SectionTitle";
import { useCurrency } from "../contexts/CurrencyContext";
import { useLocale } from "../contexts/LocaleContext";
import { facilities } from "../data/catalog";
import { makePlanFromSelection } from "../data/smartPlan";
import { useAppStore } from "../stores/appStore";
import { Facility } from "../types/domain";

export function ActivityContextPage() {
  const navigate = useNavigate();
  const { format } = useCurrency();
  const { t } = useLocale();
  const { planItems, removePlanItem, setSmartPlan } = useAppStore();
  const selected = planItems
    .map((id) => facilities.find((facility) => facility.id === id))
    .filter((facility): facility is Facility => Boolean(facility));

  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow={t("nav.activityContext")}
        title={t("activity.title")}
        action={`${selected.length} ${t("activity.offers")}`}
      />
      <div className="comfort-banner">
        <div>
          <strong>{t("activity.generateTitle")}</strong>
          <span>{t("activity.generateText")}</span>
        </div>
        <button
          className="primary"
          disabled={selected.length === 0}
          onClick={() => {
            setSmartPlan(makePlanFromSelection(planItems));
            navigate("/smart-plan");
          }}
        >
          <Sparkles size={18} />
          {t("smart.generate")}
        </button>
      </div>
      <div className="reservation-list activity-cart">
        {selected.length === 0 ? (
          <article className="empty-state">
            <Ticket size={44} />
            <h2>{t("activity.emptyTitle")}</h2>
            <p>{t("activity.emptyText")}</p>
          </article>
        ) : (
          selected.map((facility) => (
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
                <button className="ghost" onClick={() => removePlanItem(facility.id)}>
                  <Trash2 size={16} />
                  {t("common.remove")}
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
