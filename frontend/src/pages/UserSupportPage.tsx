import { HelpCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionTitle } from "../components/SectionTitle";

export function UserSupportPage() {
  return (
    <section className="page-shell">
      <SectionTitle eyebrow="Traveler" title="Support center" action="Help" />
      <div className="support-grid">
        {[
          ["Booking changes", "Change dates, guests, cancellation status, or provider notes."],
          ["Smart-plan help", "Generate plans from bookings, suggestions, budget, persons, and wilaya."],
          ["Provider issue", "Report inaccurate photos, wrong availability, or a missing service detail."],
        ].map(([title, text]) => (
          <article className="material-panel support-card" key={title}>
            <HelpCircle />
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <Link className="primary support-cta" to="/contact">
        <Mail size={18} />
        Contact Ajizour support
      </Link>
    </section>
  );
}
