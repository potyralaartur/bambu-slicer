import type { ReactNode } from "react";

import "./SectionHeader.css";

function ChevronDownSmallIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4.47 6.47a.75.75 0 0 1 1.06 0L8 8.94l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 0-1.06Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
        stroke="currentColor"
        strokeWidth={1.25}
      />
      <path
        d="M3.5 10h13M10 2.5c2.5 2.2 2.5 12.8 0 15M10 2.5c-2.5 2.2-2.5 12.8 0 15"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
      />
    </svg>
  );
}

export type SectionHeaderProps = {
  title: string;
  /** When true, shows a chevron that fades in on header hover/focus (matches Figma Resting vs Hover). */
  collapsible?: boolean;
  /** Renders the trailing icon control (globe in Figma). Default true to match the design component. */
  showTrailingAction?: boolean;
  ariaLabel?: string;
  trailingActionAriaLabel?: string;
  onTrailingActionClick?: () => void;
  /** Right-hand slot (fixed min width in Figma); omit when unused. */
  endSlot?: ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  collapsible = false,
  showTrailingAction = true,
  ariaLabel,
  trailingActionAriaLabel = "Section actions",
  onTrailingActionClick,
  endSlot,
  className = "",
}: SectionHeaderProps) {
  const rootClass = [
    "section-header",
    collapsible ? "section-header--collapsible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass} role="group" aria-label={ariaLabel}>
      <div className="section-header__main">
        <div className="section-header__title-block">
          {collapsible ? (
            <span className="section-header__chevron">
              <ChevronDownSmallIcon />
            </span>
          ) : null}
          <p className="section-header__title">{title}</p>
        </div>
        {showTrailingAction ? (
          <button
            type="button"
            className="section-header__icon-btn"
            aria-label={trailingActionAriaLabel}
            onClick={onTrailingActionClick}
          >
            <GlobeIcon />
          </button>
        ) : null}
      </div>
      {endSlot != null ? (
        <div className="section-header__end">{endSlot}</div>
      ) : null}
    </div>
  );
}
