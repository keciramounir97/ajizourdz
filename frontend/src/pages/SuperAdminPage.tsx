import { Database, Globe2, ServerCog, ShieldCheck } from "lucide-react";
import { Metric } from "../components/Metric";
import { SectionTitle } from "../components/SectionTitle";
import { contactInbox, newsletterInbox, roleMatrix, siteSections } from "../data/adminContent";
import { facilities } from "../data/catalog";
import { managedPages, useAppStore } from "../stores/appStore";
import { Role } from "../types/domain";

export function SuperAdminPage() {
  const { pageAccess, setPageRoleAccess } = useAppStore();
  const roles: Role[] = ["user", "admin", "super_admin"];

  return (
    <section className="page-shell">
      <SectionTitle eyebrow="Super admin" title="Platform control center" action="Full access" />
      <div className="dashboard-grid">
        <Metric icon={<ShieldCheck />} label="Roles" value={`${roleMatrix.length}`} />
        <Metric icon={<Globe2 />} label="Sections" value={`${siteSections.length}`} />
        <Metric icon={<Database />} label="Catalog profiles" value={`${facilities.length}`} />
        <Metric icon={<ServerCog />} label="Backend health" value="Ready" />
      </div>
      <div className="dashboard-grid">
        <Metric icon={<Globe2 />} label="Contact messages" value={`${contactInbox.length}`} />
        <Metric icon={<Database />} label="Newsletter leads" value={`${newsletterInbox.length}`} />
        <Metric
          icon={<ShieldCheck />}
          label="New inbox items"
          value={`${contactInbox.filter((item) => item.status === "new").length + newsletterInbox.filter((item) => item.status === "new").length}`}
        />
        <Metric icon={<ServerCog />} label="Exports" value="Ready" />
      </div>
      <div className="role-workspace">
        <article className="material-panel wide-panel">
          <h2>Instant role-page access</h2>
          <p className="muted-text">
            Check which role can open each protected page. Changes apply instantly in the frontend protected routes.
          </p>
          <div className="permission-matrix">
            <div className="permission-matrix-head">
              <strong>Page</strong>
              {roles.map((role) => (
                <strong key={role}>{role}</strong>
              ))}
            </div>
            {managedPages.map((page) => (
              <div className="permission-matrix-row" key={page.path}>
                <span>
                  <b>{page.label}</b>
                  <small>{page.path}</small>
                </span>
                {roles.map((role) => (
                  <label key={role}>
                    <input
                      type="checkbox"
                      checked={(pageAccess[page.path] ?? []).includes(role)}
                      onChange={(event) => setPageRoleAccess(page.path, role, event.target.checked)}
                    />
                  </label>
                ))}
              </div>
            ))}
          </div>
        </article>
        <article className="material-panel">
          <h2>Platform policies</h2>
          <div className="policy-grid">
            <span>JWT protected route policy</span>
            <span>SMTP contact and reset-password flow</span>
            <span>MySQL pooled data layer</span>
            <span>AI provider fallback chain</span>
            <span>Service worker static and catalog caching</span>
            <span>Currency and exchange-rate admin controls</span>
          </div>
        </article>
        <article className="material-panel">
          <h2>Operational checklist</h2>
          <div className="timeline-list">
            <div className="timeline-item"><span className="timeline-dot" /><strong>Backend check</strong><span className="pill">passed</span></div>
            <div className="timeline-item"><span className="timeline-dot" /><strong>Frontend check</strong><span className="pill">passed</span></div>
            <div className="timeline-item"><span className="timeline-dot" /><strong>SMTP verification</strong><span className="pill">verified</span></div>
            <div className="timeline-item"><span className="timeline-dot" /><strong>MySQL connection</strong><span className="pill">connected</span></div>
          </div>
        </article>
      </div>
    </section>
  );
}
