import { Building2, Lock, Mail, Music, Sparkles, Store, User } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLocale } from "../contexts/LocaleContext";
import logo from "../assets/ajizor-logo-horizontal.svg";

type SignupMode = "client" | "partner";

const partnerCategories = [
  { value: "Hotel", label: "Hotel owner / manager" },
  { value: "Dortoir", label: "Dortoir owner / manager" },
  { value: "Cite universitaire", label: "Cite universitaire manager" },
  { value: "Restaurant", label: "Restaurant owner" },
  { value: "Activity provider", label: "Activity provider" },
  { value: "Service provider", label: "Service provider for activities" },
];

const activityFields = [
  "Music",
  "Entertainment",
  "Beach club",
  "Boat tour",
  "Scuba diving",
  "Jet ski",
  "Quad rental",
  "Tour guide",
  "Transport",
  "Photography",
  "Camping",
  "Horse riding",
  "Swimming team",
  "Event animation",
];

export function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const [mode, setMode] = useState<SignupMode>("client");
  const [name, setName] = useState("New Coastal Traveler");
  const [email, setEmail] = useState("traveler@ajizor.dz");
  const [password, setPassword] = useState("client123");
  const [partnerCategory, setPartnerCategory] = useState("Hotel");
  const [activityField, setActivityField] = useState("Music");
  const [businessName, setBusinessName] = useState("My Coastal Business");
  const [wilaya, setWilaya] = useState("Bejaia");

  const isActivityPartner = useMemo(
    () => partnerCategory === "Activity provider" || partnerCategory === "Service provider",
    [partnerCategory],
  );

  if (isAuthenticated) return <Navigate to="/profile" replace />;

  function submit(event: FormEvent) {
    event.preventDefault();
    const providerType =
      mode === "client"
        ? "Traveler"
        : isActivityPartner
          ? `${partnerCategory} - ${activityField}`
          : partnerCategory;

    register({
      name: mode === "client" ? name : `${name} (${businessName})`,
      email,
      password,
      role: mode === "client" ? "user" : "admin",
      providerType,
      permissions:
        mode === "client"
          ? ["bookings:create", "smart-plans:create"]
          : ["offers:write", "bookings:manage", "provider-profile:write"],
    });
    navigate(mode === "client" ? "/dashboard" : "/admin", { replace: true });
  }

  return (
    <section className="auth-page compact-auth">
      <form className="auth-card signup-card" onSubmit={submit}>
        <img className="auth-form-logo" src={logo} alt="AJIZOUR logo" />
        <span className="pill">{t("auth.account")}</span>
        <h2>{mode === "client" ? t("auth.signupClient") : t("auth.signupPartner")}</h2>

        <div className="signup-mode-tabs" role="tablist" aria-label={t("auth.signupType")}>
          <button type="button" className={mode === "client" ? "selected" : ""} onClick={() => setMode("client")}>
            <User size={18} />
            {t("auth.client")}
          </button>
          <button type="button" className={mode === "partner" ? "selected" : ""} onClick={() => setMode("partner")}>
            <Building2 size={18} />
            {t("auth.partner")}
          </button>
        </div>

        <label>
          <User size={18} />
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder={t("auth.fullName")} />
        </label>
        <label>
          <Mail size={18} />
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t("contact.email")} />
        </label>
        <label>
          <Lock size={18} />
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t("auth.password")} />
        </label>

        {mode === "partner" && (
          <div className="partner-fields">
            <label>
              <Store size={18} />
              <input value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder={t("auth.businessName")} />
            </label>
            <label>
              {t("auth.partnerType")}
              <select value={partnerCategory} onChange={(event) => setPartnerCategory(event.target.value)}>
                {partnerCategories.map((category) => (
                  <option value={category.value} key={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            {isActivityPartner && (
              <label>
                <Music size={18} />
                <select value={activityField} onChange={(event) => setActivityField(event.target.value)}>
                  {activityFields.map((field) => (
                    <option key={field}>{field}</option>
                  ))}
                </select>
              </label>
            )}
            <label>
              {t("auth.wilayaServed")}
              <input value={wilaya} onChange={(event) => setWilaya(event.target.value)} />
            </label>
            <div className="partner-summary">
              <Sparkles size={18} />
              <span>
                {t("auth.partnerSummary")}
              </span>
            </div>
          </div>
        )}

        <button className="primary">{mode === "client" ? t("auth.createClient") : t("auth.createPartner")}</button>
        <Link className="ghost full" to="/login">
          {t("auth.hasAccount")}
        </Link>
      </form>
    </section>
  );
}
