import { ClipboardCheck, Store } from "lucide-react";
import { SectionTitle } from "../components/SectionTitle";
import { useCurrency } from "../contexts/CurrencyContext";
import { moderationQueue } from "../data/adminContent";
import { adminOffers } from "../data/catalog";

export function AdminOffersPage() {
  const { format } = useCurrency();

  return (
    <section className="page-shell">
      <SectionTitle eyebrow="Admin" title="Offers and moderation" action={`${adminOffers.length} offers`} />
      <div className="admin-layout">
        <article className="material-panel">
          <h2>
            <Store size={20} /> Offer inventory
          </h2>
          <div className="offer-grid compact-offers">
            {adminOffers.map((offer) => (
              <div className="offer-card" key={offer.id}>
                <span className="pill">{offer.status}</span>
                <h3>{offer.title}</h3>
                <p>{offer.category} · {offer.wilaya}</p>
                <strong>{format(offer.price)}</strong>
              </div>
            ))}
          </div>
        </article>
        <article className="material-panel">
          <h2>
            <ClipboardCheck size={20} /> Moderation queue
          </h2>
          <div className="admin-table">
            {moderationQueue.map((item) => (
              <div className="admin-row moderation-row" key={item.id}>
                <span className="pill">{item.status}</span>
                <strong>{item.item}</strong>
                <span>{item.owner}</span>
                <span>{item.type}</span>
                <b>{item.risk}</b>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
