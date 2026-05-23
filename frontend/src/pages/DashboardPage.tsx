import { CalendarClock, CircleDollarSign, Cog, Inbox, LayoutList, ShieldCheck, Sparkles, Store, Ticket, User, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Metric } from "../components/Metric";
import { SectionTitle } from "../components/SectionTitle";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { facilities } from "../data/catalog";
import { useAppStore } from "../stores/appStore";

export function DashboardPage() {
  const { user } = useAuth();
  const { bookings, planItems, smartPlan } = useAppStore();
  const { format } = useCurrency();
  const total = bookings.reduce((sum, booking) => sum + booking.total, 0);

  return (
    <section className="page-shell">
      <SectionTitle eyebrow="Dashboard" title={`Welcome ${user?.name ?? "traveler"}`} action={user?.role ?? "user"} />
      <div className="dashboard-grid">
        <Metric icon={<CalendarClock />} label="Bookings" value={`${bookings.length}`} />
        <Metric icon={<Ticket />} label="Activity context" value={`${planItems.length}`} />
        <Metric icon={<CircleDollarSign />} label="Booked value" value={format(total)} />
        <Metric icon={<Sparkles />} label="Smart plan" value={smartPlan ? "Ready" : "Not yet"} />
      </div>
      <div className="admin-layout">
        <article className="admin-table-panel">
          <h2>
            <User size={20} /> Account
          </h2>
          <p className="muted-text">{user?.email}</p>
          <p>{user?.providerType} workspace with role-based access and protected routes.</p>
          <div className="dashboard-action-grid">
            <Link className="ghost" to="/my-trips"><CalendarClock size={16} /> My trips</Link>
            <Link className="ghost" to="/activity-context"><Ticket size={16} /> Activity context</Link>
            <Link className="ghost" to="/settings"><Cog size={16} /> Settings</Link>
            {user?.role !== "user" && <Link className="ghost" to="/admin"><ShieldCheck size={16} /> Admin</Link>}
            {user?.role !== "user" && <Link className="ghost" to="/admin/clients"><Users size={16} /> Clients</Link>}
            {user?.role !== "user" && <Link className="ghost" to="/admin/partners"><Store size={16} /> Partners</Link>}
            {user?.role === "super_admin" && <Link className="ghost" to="/super-admin"><ShieldCheck size={16} /> Super admin</Link>}
          </div>
        </article>
        <article className="admin-table-panel">
          <h2>Recommended next offers</h2>
          <div className="admin-table">
            {facilities.slice(0, 4).map((facility) => (
              <div className="admin-row" key={facility.id}>
                <span className="pill">{facility.category}</span>
                <strong>{facility.name}</strong>
                <span>{facility.wilaya}</span>
                <b>{format(facility.price)}</b>
              </div>
            ))}
          </div>
        </article>
      </div>
      {user?.role !== "user" && (
        <article className="material-panel">
          <h2>Admin shortcuts</h2>
          <div className="dashboard-action-grid admin-shortcuts">
            <Link className="ghost" to="/admin/users"><Users size={16} /> Users and roles</Link>
            <Link className="ghost" to="/admin/clients"><Users size={16} /> Clients</Link>
            <Link className="ghost" to="/admin/partners"><Store size={16} /> Partners</Link>
            <Link className="ghost" to="/admin/sections"><LayoutList size={16} /> Website sections</Link>
            <Link className="ghost" to="/admin/contacts"><Inbox size={16} /> Contacts</Link>
          </div>
        </article>
      )}
    </section>
  );
}
