import "./LargeSelector.css";

const DEFAULT_IMAGE = "/assets/large-selector/printer.png";

function ChevronDownIcon() {
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

export type LargeSelectorProps = {
  label: string;
  imageSrc?: string;
  /** Selected / open state — uses stronger border (Figma active). */
  active?: boolean;
  className?: string;
  onClick?: () => void;
  id?: string;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-haspopup"?:
    | boolean
    | "true"
    | "false"
    | "menu"
    | "listbox"
    | "tree"
    | "grid"
    | "dialog";
};

export function LargeSelector({
  label,
  imageSrc = DEFAULT_IMAGE,
  active = false,
  className = "",
  onClick,
  id,
  disabled = false,
  "aria-label": ariaLabel,
  "aria-expanded": ariaExpanded,
  "aria-haspopup": ariaHaspopup,
}: LargeSelectorProps) {
  const expanded = ariaExpanded === true;
  const showActive = active || expanded;

  const rootClass = [
    "large-selector",
    showActive ? "large-selector--active" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      id={id}
      className={rootClass}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
    >
      <span className="large-selector__thumb">
        <img
          src={imageSrc}
          alt=""
          className="large-selector__image"
          width={56}
          height={56}
          draggable={false}
        />
      </span>
      <span className="large-selector__row">
        <span className="large-selector__label">
          <span className="large-selector__label-text">{label}</span>
        </span>
        <span className="large-selector__chevron" aria-hidden>
          <ChevronDownIcon />
        </span>
      </span>
    </button>
  );
}
