import { CalendarDays, MapPin, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../contexts/LocaleContext";
import { coastalWilayas } from "../data/catalog";

export function SearchBox() {
  const { t } = useLocale();
  const navigate = useNavigate();

  return (
    <form className="search-box" onSubmit={(event) => event.preventDefault()}>
      <label>
        <MapPin size={18} />
        <select defaultValue="">
          <option value="" disabled>
            {t("search.destination")}
          </option>
          {coastalWilayas.map((wilaya) => (
            <option key={wilaya}>{wilaya}</option>
          ))}
        </select>
      </label>
      <label>
        <CalendarDays size={18} />
        <input type="date" defaultValue="2026-06-20" />
      </label>
      <label>
        <Users size={18} />
        <input min={1} type="number" defaultValue={2} />
      </label>
      <button onClick={() => navigate("/smart-plan")}>
        <Search size={18} />
        {t("search.button")}
      </button>
    </form>
  );
}
