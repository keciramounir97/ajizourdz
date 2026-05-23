import { Lock, Mail, UserRoundCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/ajizor-logo-horizontal.svg";
import { useAuth } from "../contexts/AuthContext";
import { useLocale } from "../contexts/LocaleContext";

export function LoginPage() {
  const { login, quickLogin, accounts, isAuthenticated } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";
  const [email, setEmail] = useState("client@ajizor.dz");
  const [password, setPassword] = useState("client123");
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to={from} replace />;

  function submit(event: FormEvent) {
    event.preventDefault();
    const ok = login(email, password);
    if (!ok) {
      setError(t("auth.loginError"));
      return;
    }
    navigate(from, { replace: true });
  }

  return (
    <section className="auth-page">
      <div className="auth-visual">
        <img src={logo} alt="AJIZOR logo" />
        <h1>{t("auth.welcome")}</h1>
        <p>{t("auth.welcomeText")}</p>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <img className="auth-form-logo" src={logo} alt="AJIZOUR logo" />
        <span className="pill">{t("auth.secureAccess")}</span>
        <h2>{t("auth.login")}</h2>
        <label>
          <Mail size={18} />
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          <Lock size={18} />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error && <span className="form-error">{error}</span>}
        <button className="primary">{t("auth.login")}</button>
        <Link className="ghost full" to="/reset-password">
          {t("auth.forgot")}
        </Link>
        <Link className="ghost full" to="/register">
          {t("auth.createTraveler")}
        </Link>
        <div className="demo-logins">
          <strong>{t("auth.demoAccess")}</strong>
          {accounts.map((account) => (
            <button
              type="button"
              key={account.id}
              onClick={() => {
                quickLogin(account.id);
                navigate(from, { replace: true });
              }}
            >
              <UserRoundCheck size={16} />
              {account.role}: {account.email}
            </button>
          ))}
        </div>
      </form>
    </section>
  );
}
