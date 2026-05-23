import { Eye, LayoutList } from "lucide-react";
import { SectionTitle } from "../components/SectionTitle";
import { siteSections } from "../data/adminContent";

export function AdminSectionsPage() {
  return (
    <section className="page-shell">
      <SectionTitle eyebrow="Admin" title="Website sections" action={`${siteSections.length} sections`} />
      <article className="material-panel">
        <h2>
          <LayoutList size={20} /> Section control
        </h2>
        <div className="section-control-grid">
          {siteSections.map((section) => (
            <div className="section-control-card" key={section.id}>
              <div>
                <span className="pill">{section.enabled ? "enabled" : "hidden"}</span>
                <h3>{section.title}</h3>
                <p>{section.content}</p>
              </div>
              <a className="ghost" href={section.route}>
                <Eye size={16} />
                View
              </a>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
