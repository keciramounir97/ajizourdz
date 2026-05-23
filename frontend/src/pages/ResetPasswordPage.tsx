import { KeyRound, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import logo from "../assets/ajizor-logo-horizontal.svg";
import { useLocale } from "../contexts/LocaleContext";

export function ResetPasswordPage() {
  const [email, setEmail] = useState("client@ajizor.dz");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const { t } = useLocale();

  async function requestReset(event: FormEvent) {
    event.preventDefault();
    setStatus(t("reset.requesting"));
    try {
      await api("/auth/reset-password", { method: "POST", body: JSON.stringify({ email }) });
      setStatus(t("reset.sent"));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t("reset.failed"));
    }
  }

  async function confirmReset(event: FormEvent) {
    event.preventDefault();
    setStatus(t("reset.updating"));
    try {
      await api("/auth/reset-password/confirm", { method: "POST", body: JSON.stringify({ token, password }) });
      setStatus(t("reset.updated"));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t("reset.updateFailed"));
    }
  }

  return (
    <section className="auth-page compact-auth">
      <form className="auth-card" onSubmit={requestReset}>
        <img className="auth-form-logo" src={logo} alt="AJIZOUR logo" />
        <span className="pill">{t("reset.form")}</span>
        <h2>{t("reset.title")}</h2>
        <label>
          <Mail size={18} />
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <button className="primary">{t("reset.send")}</button>
      </form>
      <form className="auth-card" onSubmit={confirmReset}>
        <h2>{t("reset.confirm")}</h2>
        <label>
          <KeyRound size={18} />
          <input placeholder={t("reset.token")} value={token} onChange={(event) => setToken(event.target.value)} />
        </label>
        <label>
          {t("reset.newPassword")}
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button className="primary">{t("reset.update")}</button>
        {status && <p className="muted-text">{status}</p>}
        <Link className="ghost full" to="/login">{t("reset.back")}</Link>
      </form>
    </section>
  );
}
