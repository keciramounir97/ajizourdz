import { Plane, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { SectionTitle } from "../components/SectionTitle";
import { useCurrency } from "../contexts/CurrencyContext";
import { useLocale } from "../contexts/LocaleContext";
import { coastalWilayas } from "../data/catalog";
import { makeCustomPlan, makePlanFromReservations, makeSuggestedPlan } from "../data/smartPlan";
import { useAppStore } from "../stores/appStore";

export function SmartPlanPage() {
  const { bookings, smartPlan, setSmartPlan } = useAppStore();
  const { format } = useCurrency();
  const { t } = useLocale();
  const [wilaya, setWilaya] = useState("Bejaia");
  const [mood, setMood] = useState("adventure");
  const [days, setDays] = useState(3);

  function generatePlan(event: FormEvent) {
    event.preventDefault();
    setSmartPlan(makeCustomPlan(wilaya, mood, days));
  }

  return (
    <section className="page-shell smart-layout">
      <div>
        <SectionTitle
          eyebrow="AI travel assistant"
          title={t("smart.title")}
          action="Itinerary"
        />
        <form className="planner" onSubmit={generatePlan}>
          <p className="planner-intro">
            Choose a destination manually, generate from your reservations, or
            ask AJIZOR to suggest one automatically without selecting an
            activity.
          </p>
          <div className="smart-actions">
            <button
              type="button"
              className="ghost"
              disabled={bookings.length === 0}
              onClick={() => setSmartPlan(makePlanFromReservations(bookings))}
            >
              Make one out of my reservations
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() => setSmartPlan(makeSuggestedPlan())}
            >
              Suggest me one
            </button>
          </div>
          <label>
            Wilaya
            <select value={wilaya} onChange={(event) => setWilaya(event.target.value)}>
              {coastalWilayas.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          <label>
            Mood
            <select value={mood} onChange={(event) => setMood(event.target.value)}>
              <option value="adventure">Adventure</option>
              <option value="family">Family</option>
              <option value="romantic">Romantic</option>
              <option value="budget">Budget</option>
            </select>
          </label>
          <label>
            Days
            <input
              min={1}
              max={7}
              type="number"
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
            />
          </label>
          <button className="primary">
            <Sparkles size={18} /> {t("smart.generate")}
          </button>
        </form>
      </div>

      <article className="plan-result">
        {smartPlan ? (
          <>
            <span className="pill">{smartPlan.mood}</span>
            <h2>{smartPlan.title}</h2>
            <strong>Estimated budget: {format(smartPlan.budget)}</strong>
            {smartPlan.days.map((day) => (
              <p key={day}>{day}</p>
            ))}
          </>
        ) : (
          <>
            <Plane size={44} />
            <h2>{t("smart.placeholder")}</h2>
            <p>
              The travel assistant combines destination, mood, days, offers, and budget
              into a traveler-ready itinerary page.
            </p>
          </>
        )}
      </article>
    </section>
  );
}
