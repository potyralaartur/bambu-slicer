import type { ReactNode } from "react";

import { IconButton } from "../IconButton/IconButton";

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
      preserveAspectRatio="xMidYMid meet"
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
  /**
   * When `true`, the section can collapse (chevron on the title, hover affordance).
   * Use with `expanded`, `onToggle`, and `panelId` so the header toggles the panel.
   * @default false — only opt-in sections (e.g. Printer, Filament) set this to `true`.
   */
  collapsible?: boolean;
  /**
   * Panel open state when `collapsible` is enabled. `false` means collapsed (chevron points right).
   */
  expanded?: boolean;
  /** Called when the title row toggle is activated (`collapsible` sections). */
  onToggle?: () => void;
  /** `id` of the region controlled by the title toggle (`aria-controls`). */
  panelId?: string;
  /** Renders the trailing icon control (globe in Figma). Default true to match the design component. */
  showTrailingAction?: boolean;
  ariaLabel?: string;
  trailingActionAriaLabel?: string;
  onTrailingActionClick?: () => void;
  /**
   * Figma 2613:616 — fixed 94px slot for secondary icon actions (e.g. Printer cloud + gear).
   * Renders to the right of the main title row; omit when unused.
   */
  endSlot?: ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  collapsible = false,
  expanded = true,
  onToggle,
  panelId,
  showTrailingAction = true,
  ariaLabel,
  trailingActionAriaLabel = "Section actions",
  onTrailingActionClick,
  endSlot,
  className = "",
}: SectionHeaderProps) {
  const isToggle = Boolean(collapsible && onToggle);
  const collapsed = isToggle && !expanded;

  const rootClass = [
    "section-header",
    collapsible ? "section-header--collapsible" : "",
    isToggle && collapsed ? "section-header--collapsed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const titleBlock = (() => {
    if (!collapsible) {
      return (
        <div className="section-header__title-block">
          <p className="section-header__title">{title}</p>
        </div>
      );
    }

    const chevron = (
      <span className="section-header__chevron" aria-hidden>
        <ChevronDownSmallIcon />
      </span>
    );

    if (isToggle) {
      return (
        <button
          type="button"
          className="section-header__toggle"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={onToggle}
        >
          {chevron}
          <p className="section-header__title">{title}</p>
        </button>
      );
    }

    return (
      <div className="section-header__title-block">
        {chevron}
        <p className="section-header__title">{title}</p>
      </div>
    );
  })();

  return (
    <div className={rootClass} role="group" aria-label={ariaLabel}>
      <div className="section-header__main">
        {titleBlock}
        {showTrailingAction ? (
          <IconButton
            aria-label={trailingActionAriaLabel}
            onClick={onTrailingActionClick}
          >
            <GlobeIcon />
          </IconButton>
        ) : null}
      </div>
      {endSlot != null ? (
        <div className="section-header__end">{endSlot}</div>
      ) : null}
    </div>
  );
}
