import { Star } from "lucide-react";
import { SectionTitle } from "../components/SectionTitle";
import { reviewSeeds } from "../data/adminContent";

export function ReviewsPage() {
  return (
    <section className="page-shell">
      <SectionTitle eyebrow="Trust" title="Ratings and reviews" action="Booking · TripAdvisor · Airbnb style" />
      <div className="review-grid">
        {reviewSeeds.map((review) => (
          <article className="material-panel review-card" key={review.id}>
            <div className="review-score">
              <Star size={18} fill="currentColor" />
              <strong>{review.rating}</strong>
            </div>
            <span className="pill">{review.source}</span>
            <h2>{review.offer}</h2>
            <p>{review.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
