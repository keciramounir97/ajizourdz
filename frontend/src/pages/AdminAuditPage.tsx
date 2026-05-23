import { Activity, ServerCog } from "lucide-react";
import { SectionTitle } from "../components/SectionTitle";
import { auditEvents } from "../data/adminContent";

export function AdminAuditPage() {
  return (
    <section className="page-shell">
      <SectionTitle eyebrow="Admin" title="Audit logs and system health" action="Live checks" />
      <div className="role-workspace">
        <article className="material-panel feature-panel">
          <ServerCog />
          <h2>System status</h2>
          <p>Backend check, frontend check, SMTP verification, MySQL connection, and cache service are all surfaced in the diagnostics script.</p>
          <code>npm run check:all</code>
        </article>
        <article className="material-panel">
          <h2>
            <Activity size={20} /> Audit events
          </h2>
          <div className="timeline-list">
            {auditEvents.map((event) => (
              <div className="timeline-item" key={event.id}>
                <span className="timeline-dot" />
                <div>
                  <strong>{event.action}</strong>
                  <p>{event.actor} · {event.time}</p>
                </div>
                <span className="pill">{event.level}</span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
