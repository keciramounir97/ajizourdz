import { CalendarCheck, Compass, Hotel, Sparkles, Store, Utensils } from "lucide-react";
import { useState } from "react";
import logo from "../assets/ajizor-logo-horizontal.svg";
import { CategoryTile } from "../components/CategoryTile";
import { FacilityCard } from "../components/FacilityCard";
import { SearchBox } from "../components/SearchBox";
import { SectionTitle } from "../components/SectionTitle";
import { useLocale } from "../contexts/LocaleContext";
import { facilities, heroSlides } from "../data/catalog";

export function HomePage() {
  const { t } = useLocale();
  const [slide, setSlide] = useState(0);
  const current = heroSlides[slide];

  return (
    <>
      <section className="hero">
        <img src={current.image} alt="" />
        <div className="hero-content">
          <div className="hero-logo">
            <img src={logo} alt="AJIZOR logo" />
          </div>
          <h1>{t(current.titleKey)}</h1>
          <p>{t("hero.subtitle")}</p>
          <div className="hero-trust-row">
            <span>{t("hero.trustWilayas")}</span>
            <span>{t("hero.trustServices")}</span>
            <span>{t("hero.trustSmart")}</span>
          </div>
          <SearchBox />
          <div className="slide-controls">
            <button
              aria-label="Previous slide"
              onClick={() =>
                setSlide((value) =>
                  value === 0 ? heroSlides.length - 1 : value - 1,
                )
              }
            >
              ‹
            </button>
            <span>
              {slide + 1} / {heroSlides.length}
            </span>
            <button
              aria-label="Next slide"
              onClick={() =>
                setSlide((value) => (value + 1) % heroSlides.length)
              }
            >
              ›
            </button>
          </div>
        </div>
      </section>

      <section className="quick-grid">
        <CategoryTile
          to="/dormir"
          icon={<Hotel />}
          title={t("nav.sleep")}
          text={t("home.sleepText")}
        />
        <CategoryTile
          to="/manger"
          icon={<Utensils />}
          title={t("nav.eat")}
          text={t("home.eatText")}
        />
        <CategoryTile
          to="/activites"
          icon={<Compass />}
          title={t("nav.activities")}
          text={t("home.activitiesText")}
        />
      </section>

      <section className="section">
        <SectionTitle
          eyebrow={t("home.market")}
          title={t("home.topPicks")}
          action={t("home.featured")}
        />
        <div className="cards">
          {facilities.slice(0, 4).map((facility) => (
            <FacilityCard key={facility.id} facility={facility} />
          ))}
        </div>
      </section>

      <section className="section story-section">
        <SectionTitle
          eyebrow={t("home.how")}
          title={t("home.flowTitle")}
          action={t("home.flowAction")}
        />
        <div className="workflow-grid">
          <article>
            <span>
              <Compass />
            </span>
            <h3>{t("home.discover")}</h3>
            <p>{t("home.discoverText")}</p>
          </article>
          <article>
            <span>
              <CalendarCheck />
            </span>
            <h3>{t("home.reserve")}</h3>
            <p>{t("home.reserveText")}</p>
          </article>
          <article>
            <span>
              <Sparkles />
            </span>
            <h3>{t("home.plan")}</h3>
            <p>{t("home.planText")}</p>
          </article>
          <article>
            <span>
              <Store />
            </span>
            <h3>{t("home.manage")}</h3>
            <p>{t("home.manageText")}</p>
          </article>
        </div>
      </section>
    </>
  );
}
