import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { FacilityCard } from "../components/FacilityCard";
import { SectionTitle } from "../components/SectionTitle";
import { useLocale } from "../contexts/LocaleContext";
import { coastalWilayas, facilities } from "../data/catalog";
import { Category } from "../types/domain";

export function ListingPage({
  category,
  titleKey,
}: {
  category: Category;
  titleKey: string;
}) {
  const { t } = useLocale();
  const [wilaya, setWilaya] = useState("All");
  const [query, setQuery] = useState("");
  const [providerType, setProviderType] = useState("All");
  const [maxBudget, setMaxBudget] = useState("");
  const [sort, setSort] = useState("recommended");
  const providerTypes = useMemo(
    () =>
      Array.from(
        new Set(
          facilities
            .filter((facility) => facility.category === category)
            .map((facility) => facility.providerType),
        ),
      ),
    [category],
  );
  const items = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const budget = Number(maxBudget);
    return facilities
      .filter((facility) => {
        const text = [
          facility.name,
          facility.wilaya,
          facility.city,
          facility.host,
          facility.providerType,
          ...facility.tags,
          ...facility.amenities,
        ].join(" ").toLowerCase();
        return (
          facility.category === category &&
          (wilaya === "All" || facility.wilaya === wilaya) &&
          (providerType === "All" || facility.providerType === providerType) &&
          (!normalized || text.includes(normalized)) &&
          (!budget || facility.price <= budget)
        );
      })
      .sort((a, b) => {
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;
        if (sort === "rating") return b.rating - a.rating;
        return b.reviews - a.reviews;
      });
  }, [category, maxBudget, providerType, query, sort, wilaya]);

  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow={t("home.market")}
        title={t(titleKey)}
        action={`${items.length} ${t("listing.profiles")}`}
      />
      <div className="page-intro-panel">
        <p>{t("listing.intro")}</p>
      </div>
      <div className="catalog-filter-panel">
        <label>
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("listing.searchPlaceholder")}
          />
        </label>
        <label>
          <SlidersHorizontal size={18} />
          <select value={providerType} onChange={(event) => setProviderType(event.target.value)}>
            <option value="All">{t("listing.allTypes")}</option>
            {providerTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <label>
          {t("listing.maxBudget")}
          <input
            min={1}
            type="number"
            value={maxBudget}
            onChange={(event) => setMaxBudget(event.target.value)}
          />
        </label>
        <label>
          {t("listing.sort")}
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="recommended">{t("listing.recommended")}</option>
            <option value="rating">{t("listing.bestRated")}</option>
            <option value="price-low">{t("listing.priceLow")}</option>
            <option value="price-high">{t("listing.priceHigh")}</option>
          </select>
        </label>
      </div>
      <div className="filter-strip">
        {["All", ...coastalWilayas].map((name) => (
          <button
            className={wilaya === name ? "selected" : ""}
            key={name}
            onClick={() => setWilaya(name)}
          >
            {name === "All" ? t("listing.all") : name}
          </button>
        ))}
      </div>
      <div className="listing-layout">
        <aside className="map-panel">
          <MapPin size={24} />
          <strong>{t("listing.mapTitle")}</strong>
          <span>{t("listing.mapText")}</span>
          <div className="map-stats">
            <b>{items.length}</b>
            <small>{t("listing.matching")}</small>
          </div>
        </aside>
        <div className="cards list-cards">
          {items.map((facility) => (
            <FacilityCard key={facility.id} facility={facility} wide />
          ))}
        </div>
      </div>
    </section>
  );
}
