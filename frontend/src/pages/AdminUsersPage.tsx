import { Search, ShieldCheck, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { SectionTitle } from "../components/SectionTitle";
import { useAuth } from "../contexts/AuthContext";
import { roleMatrix } from "../data/adminContent";

type Audience = "all" | "clients" | "partners";

export function AdminUsersPage({ initialAudience = "all" }: { initialAudience?: Audience }) {
  const { accounts } = useAuth();
  const [audience, setAudience] = useState<Audience>(initialAudience);
  const [query, setQuery] = useState("");
  const [providerType, setProviderType] = useState("All");
  const providerTypes = useMemo(
    () => Array.from(new Set(accounts.filter((account) => account.role !== "user").map((account) => account.providerType))),
    [accounts],
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return accounts.filter((account) => {
      const isClient = account.role === "user";
      const isPartner = account.role !== "user";
      const matchesAudience =
        audience === "all" || (audience === "clients" && isClient) || (audience === "partners" && isPartner);
      const text = `${account.name} ${account.email} ${account.role} ${account.providerType}`.toLowerCase();
      return (
        matchesAudience &&
        (providerType === "All" || account.providerType === providerType) &&
        (!q || text.includes(q))
      );
    });
  }, [accounts, audience, providerType, query]);

  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow="Admin"
        title="Users, clients and partners"
        action={`${filtered.length} accounts`}
      />
      <div className="catalog-filter-panel admin-user-filters">
        <label>
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email, role or provider"
          />
        </label>
        <label>
          Audience
          <select value={audience} onChange={(event) => setAudience(event.target.value as Audience)}>
            <option value="all">All users</option>
            <option value="clients">Clients / travelers</option>
            <option value="partners">Partners</option>
          </select>
        </label>
        <label>
          Partner category
          <select value={providerType} onChange={(event) => setProviderType(event.target.value)}>
            <option value="All">All categories</option>
            {providerTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="admin-layout">
        <article className="material-panel">
          <h2>
            <Users size={20} /> Account directory
          </h2>
          <div className="admin-table">
            {filtered.map((account) => (
              <div className="admin-row user-admin-row" key={account.id}>
                <span className="pill">{account.role}</span>
                <strong>{account.name}</strong>
                <span>{account.email}</span>
                <span>{account.providerType}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="material-panel">
          <h2>
            <ShieldCheck size={20} /> Role matrix
          </h2>
          <div className="role-list">
            {roleMatrix.map((role) => (
              <div key={role.role} className="role-card">
                <span className="pill">{role.role}</span>
                <strong>{role.label}</strong>
                <p>{role.scope}</p>
                <div className="tag-row">
                  {role.permissions.map((permission) => (
                    <span key={permission}>{permission}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
