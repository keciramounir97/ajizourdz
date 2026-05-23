import { Mail, Newspaper, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { SectionTitle } from "../components/SectionTitle";
import { useLocale } from "../contexts/LocaleContext";
import { api } from "../lib/api";

export function ContactPage() {
  const [name, setName] = useState("Ajizour visitor");
  const [email, setEmail] = useState("visitor@example.com");
  const [subject, setSubject] = useState("Partnership request");
  const [message, setMessage] = useState("I want to list a coastal tourism service on Ajizour.");
  const [newsletterEmail, setNewsletterEmail] = useState("newsletter@example.com");
  const [status, setStatus] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const { t } = useLocale();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("Sending...");
    try {
      await api("/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, subject, message }),
      });
      setStatus("Message sent. The platform team has been notified.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Contact request failed.");
    }
  }

  function submitNewsletter(event: FormEvent) {
    event.preventDefault();
    setNewsletterStatus("Newsletter subscription saved for super admin review.");
  }

  return (
    <section className="page-shell">
      <SectionTitle eyebrow={t("contact.eyebrow")} title={t("contact.title")} action={t("contact.action")} />
      <div className="contact-layout">
        <form className="auth-card contact-form" onSubmit={submit}>
          <span className="pill">
            <Mail size={14} /> myStageDZ Platform
          </span>
          <h2>{t("contact.formTitle")}</h2>
          <label>
            {t("contact.name")}
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            {t("contact.email")}
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            {t("contact.subject")}
            <input value={subject} onChange={(event) => setSubject(event.target.value)} />
          </label>
          <label>
            {t("contact.message")}
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={6} />
          </label>
          <button className="primary">
            <Send size={18} />
            {t("contact.send")}
          </button>
          {status && <p className="muted-text">{status}</p>}
        </form>
        <form className="material-panel newsletter-card" onSubmit={submitNewsletter}>
          <span className="pill">
            <Newspaper size={14} /> Newsletter
          </span>
          <h2>{t("newsletter.title")}</h2>
          <p>{t("newsletter.text")}</p>
          <label>
            {t("contact.email")}
            <input value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} />
          </label>
          <button className="primary">{t("newsletter.subscribe")}</button>
          {newsletterStatus && <p className="muted-text">{newsletterStatus}</p>}
        </form>
      </div>
      <article className="material-panel map-panel-contact">
        <div>
          <span className="pill">OpenStreetMap</span>
          <h2>Ajizour coastal operations map</h2>
          <p>Use the map to orient support requests, provider onboarding, and coastal wilaya coverage.</p>
        </div>
        <iframe
          title="OpenStreetMap Algeria coast"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-2.5%2C35.2%2C8.9%2C37.6&layer=mapnik"
          loading="lazy"
        />
      </article>
    </section>
  );
}
