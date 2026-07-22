import { FigmaIcon } from "../../icons";
import { NewTabIcon } from "../NewTabIcon/NewTabIcon";

import "./ProductCard.css";

export type ProductCardProps = {
  title: string;
  /** Attribution rendered as “by {creator}”; use `byline` for verbatim text. */
  creator?: string;
  /** Verbatim attribution line (e.g. “MakerWorld”); takes precedence over `creator`. */
  byline?: string;
  image: string;
  likes: number | string;
  downloads: number | string;
};

/** Figma 9182:3478 — MakerWorld model card. */
export function ProductCard({
  title,
  creator,
  byline,
  image,
  likes,
  downloads,
}: ProductCardProps) {
  const attribution = byline ?? (creator ? "by " + creator : "");
  return (
    <article
      className="product-card"
      aria-label={attribution ? title + ", " + attribution : title}
    >
      <div className="product-card__thumbnail">
        <img src={image} alt="" />
      </div>
      <div className="product-card__info">
        <p className="product-card__title">{title}</p>
        <p className="product-card__creator">{attribution}</p>
        <div
          className="product-card__stats"
          aria-label={likes + " likes, " + downloads + " downloads"}
        >
          <span className="product-card__stat">
            <NewTabIcon name="heart" size={14} className="product-card__stat-icon" />
            <span>{likes}</span>
          </span>
          <span className="product-card__stat">
            <FigmaIcon
              name="arrow-down-wall"
              size={14}
              className="product-card__stat-icon"
            />
            <span>{downloads}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
