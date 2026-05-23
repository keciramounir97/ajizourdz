import { ReactNode } from "react";
import { Link } from "react-router-dom";

export function CategoryTile({
  to,
  icon,
  title,
  text,
}: {
  to: string;
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Link className="category-tile" to={to}>
      <span>{icon}</span>
      <strong>{title}</strong>
      <small>{text}</small>
    </Link>
  );
}
