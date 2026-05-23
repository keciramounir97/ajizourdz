import { Building2, ShieldCheck } from "lucide-react";
import { Metric } from "../components/Metric";
import { SectionTitle } from "../components/SectionTitle";
import { providerSegments } from "../data/adminContent";
import { facilities } from "../data/catalog";

export function AdminProvidersPage() {
  const sleepCount = facilities.filter((facility) => facility.category === "sleep").length;
  const foodCount = facilities.filter((facility) => facility.category === "food").length;
  const activityCount = facilities.filter((facility) => facility.category === "activity").length;

  return (
    <section className="page-shell">
      <SectionTitle eyebrow="Admin" title="Provider owners and managers" action="Owner registry" />
      <div className="dashboard-grid">
        <Metric icon={<Building2 />} label="Sleep providers" value={`${sleepCount}`} />
        <Metric icon={<Building2 />} label="Restaurant owners" value={`${foodCount}`} />
        <Metric icon={<Building2 />} label="Activity providers" value={`${activityCount}`} />
        <Metric icon={<ShieldCheck />} label="Verification" value="Active" />
      </div>
      <div className="provider-segment-grid">
        {providerSegments.map((segment) => (
          <article className="material-panel provider-segment-card" key={segment.id}>
            <span className="pill">{segment.owners} owners</span>
            <h2>{segment.label}</h2>
            <p>{segment.description}</p>
            <div className="admin-actions">
              <button>Verify</button>
              <button>Assign manager</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
