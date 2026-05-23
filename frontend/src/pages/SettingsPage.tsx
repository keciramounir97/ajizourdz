import { Euro, Languages, Palette, SlidersHorizontal } from "lucide-react";
import { FormEvent, useState } from "react";
import { SectionTitle } from "../components/SectionTitle";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { useLocale } from "../contexts/LocaleContext";
import { useTheme } from "../contexts/ThemeContext";
import { Currency, Locale } from "../types/domain";

export function SettingsPage() {
  const { user } = useAuth();
  const { currency, setCurrency, rates, options, setRate, upsertCurrency } = useCurrency();
  const { locale, setLocale, t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const isAdmin = user?.role !== "user";
  const [newCode, setNewCode] = useState("GBP");
  const [newLabel, setNewLabel] = useState("British pound");
  const [newFlag, setNewFlag] = useState("GB");
  const [newRate, setNewRate] = useState(170);

  function submitCurrency(event: FormEvent) {
    event.preventDefault();
    upsertCurrency({ code: newCode, label: newLabel, flag: newFlag, rate: newRate });
  }

  return (
    <section className="page-shell settings-page">
      <SectionTitle
        eyebrow={t("settings.preferences")}
        title={isAdmin ? t("settings.adminTitle") : t("settings.clientTitle")}
        action={user?.name ?? t("common.guest")}
      />

      <div className="settings-grid">
        <article className="settings-panel">
          <h2>
            <Languages size={20} /> {t("settings.language")}
          </h2>
          <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
            <option value="fr">{t("lang.fr")}</option>
            <option value="en">{t("lang.en")}</option>
            <option value="ar">{t("lang.ar")}</option>
          </select>
        </article>
        <article className="settings-panel">
          <h2>
            <Euro size={20} /> {t("settings.currency")}
          </h2>
          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value as Currency)}
          >
            {options.map((option) => (
              <option value={option.code} key={option.code}>
                {option.flag} {option.code}
              </option>
            ))}
          </select>
          {(Object.keys(rates) as Currency[]).map((code) => (
            <label key={code}>
              {t("settings.ratePrefix")} {code} {t("settings.rateSuffix")}
              <input
                min={1}
                type="number"
                value={rates[code]}
                onChange={(event) => setRate(code, Number(event.target.value))}
                disabled={code === "DZD"}
              />
            </label>
          ))}
          {isAdmin && (
            <form className="inline-admin-form" onSubmit={submitCurrency}>
              <h3>{t("settings.createCurrency")}</h3>
              <input value={newCode} onChange={(event) => setNewCode(event.target.value)} placeholder={t("settings.code")} />
              <input value={newLabel} onChange={(event) => setNewLabel(event.target.value)} placeholder={t("settings.label")} />
              <input value={newFlag} onChange={(event) => setNewFlag(event.target.value)} placeholder={t("settings.flag")} />
              <input type="number" min={1} value={newRate} onChange={(event) => setNewRate(Number(event.target.value))} />
              <button className="primary">{t("settings.saveCurrency")}</button>
            </form>
          )}
        </article>
        <article className="settings-panel wide-panel">
          <h2>
            <Palette size={20} /> {t("settings.display")}
          </h2>
          <div className="settings-note">
            <SlidersHorizontal />
            <p>
              {t("settings.displayText")}
            </p>
          </div>
          <button className="ghost theme-toggle" onClick={toggleTheme}>
            {t("settings.currentTheme")}: {theme}. {t("settings.switchTheme")}
          </button>
        </article>
      </div>
    </section>
  );
}
