import { Inbox, MailCheck, Newspaper } from "lucide-react";
import { SectionTitle } from "../components/SectionTitle";
import { useLocale } from "../contexts/LocaleContext";
import { contactInbox, newsletterInbox } from "../data/adminContent";

export function AdminContactsPage() {
  const { t } = useLocale();

  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow={t("admin.contacts")}
        title={t("inbox.title")}
        action={`${contactInbox.length + newsletterInbox.length} ${t("inbox.items")}`}
      />
      <div className="inbox-split">
        <article className="material-panel">
          <h2>
            <Inbox size={20} /> {t("inbox.contacts")}
          </h2>
          <div className="contact-inbox">
            {contactInbox.map((contact) => (
              <div className="contact-row" key={contact.id}>
                <span className="pill">{contact.status}</span>
                <div>
                  <strong>{contact.subject}</strong>
                  <p>{contact.name} · {contact.email}</p>
                  <small>{contact.message}</small>
                </div>
                <button className="ghost">
                  <MailCheck size={16} />
                  {t("inbox.resolve")}
                </button>
              </div>
            ))}
          </div>
        </article>
        <article className="material-panel">
          <h2>
            <Newspaper size={20} /> {t("inbox.newsletter")}
          </h2>
          <div className="contact-inbox">
            {newsletterInbox.map((lead) => (
              <div className="newsletter-row" key={lead.id}>
                <span className="pill">{lead.status}</span>
                <div>
                  <strong>{lead.email}</strong>
                  <p>{lead.segment} · {lead.wilayaInterest}</p>
                  <small>{lead.source} · {lead.subscribedAt}</small>
                </div>
                <button className="ghost">{t("inbox.export")}</button>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
