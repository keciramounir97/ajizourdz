import {
  Activity,
  BedDouble,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  Sparkles,
  Ticket,
  User,
  Utensils,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logooftheapp.jpeg";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { useLocale } from "../contexts/LocaleContext";
import { useAppStore } from "../stores/appStore";
import { Currency, Locale } from "../types/domain";

export function Header() {
  const { t, locale, setLocale } = useLocale();
  const { currency, setCurrency } = useCurrency();
  const { user, isAuthenticated, logout } = useAuth();
  const { mobileMenu, toggleMobileMenu, closeMobileMenu } = useAppStore();
  const nav = [
    { to: "/", label: t("nav.home"), icon: <Home size={18} /> },
    { to: "/dormir", label: t("nav.sleep"), icon: <BedDouble size={18} /> },
    { to: "/manger", label: t("nav.eat"), icon: <Utensils size={18} /> },
    { to: "/activites", label: t("nav.activities"), icon: <Activity size={18} /> },
    { to: "/activity-context", label: t("nav.activityContext"), icon: <Ticket size={18} /> },
    { to: "/smart-plan", label: t("nav.smart"), icon: <Sparkles size={18} /> },
    { to: "/contact", label: t("contact.eyebrow"), icon: <Mail size={18} /> },
  ];

  return (
    <header className="topbar">
      {mobileMenu && (
        <button
          className="mobile-nav-backdrop"
          aria-label={t("nav.close")}
          onClick={closeMobileMenu}
        />
      )}

      <button
        className="menu-trigger"
        aria-label={t("nav.open")}
        aria-expanded={mobileMenu}
        onClick={toggleMobileMenu}
      >
        {mobileMenu ? <X size={20} /> : <Menu size={20} />}
      </button>

      <NavLink className="brand" to="/" onClick={closeMobileMenu}>
        <img src={logo} alt="AJIZOUR" />
        <span>AJIZOUR</span>
      </NavLink>

      <aside className={mobileMenu ? "nav-drawer open" : "nav-drawer"} aria-hidden={!mobileMenu}>
        <div className="drawer-head">
          <img src={logo} alt="AJIZOUR" />
          <strong>AJIZOUR</strong>
        </div>
        <nav>
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={closeMobileMenu}>
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="top-actions">
        <select
          aria-label="Language"
          value={locale}
          onChange={(event) => setLocale(event.target.value as Locale)}
        >
          <option value="ar">AR</option>
          <option value="fr">FR</option>
          <option value="en">EN</option>
        </select>
        <select
          aria-label="Currency"
          value={currency}
          onChange={(event) => setCurrency(event.target.value as Currency)}
        >
          <option value="DZD">DZD</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        {isAuthenticated ? (
          <div className="user-menu">
            <button className="user-chip">
              <User size={16} />
              {user?.name.split(" ")[0]}
            </button>
            <div className="user-dropdown">
              <NavLink to="/profile">
                <User size={16} />
                {t("nav.profile")}
              </NavLink>
              <NavLink to="/settings">
                <Settings size={16} />
                {t("nav.settings")}
              </NavLink>
              <NavLink to="/dashboard">
                <LayoutDashboard size={16} />
                {t("nav.dashboard")}
              </NavLink>
              <button onClick={logout}>
                <LogOut size={16} />
                {t("auth.logout")}
              </button>
            </div>
          </div>
        ) : (
          <>
            <NavLink className="login-button" to="/login">
              {t("auth.login")}
            </NavLink>
            <NavLink className="signup-button" to="/register">
              {t("auth.signup")}
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
