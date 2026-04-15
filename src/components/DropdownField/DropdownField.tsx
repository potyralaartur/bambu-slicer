import "./DropdownField.css";

/**
 * Figma: **Dropdown Field** component (main component set).
 *
 * @see https://www.figma.com/design/0H1HmDgMDUddD0yCXV0WJj/Bambu-Slicer?node-id=2488-1810
 *
 * States map to CSS: resting (no stroke), hover (Border/Base/Tertiary hover),
 * active/open (Content/Base/Secondary border). Fill stays transparent.
 */
const FIGMA_DROPDOWN_FIELD = {
  fileKey: "0H1HmDgMDUddD0yCXV0WJj",
  nodeId: "2488:1810",
} as const;

const DEFAULT_PATTERN = "/assets/dropdown-field/pattern.svg";

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

function DotsVerticalIcon() {
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
        d="M8 4.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM8 9a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 8 9Zm0 4.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export type DropdownFieldProps = {
  label: string;
  value: string;
  /** Optional 20×20 pattern preview (Figma “Pattern” slot). */
  showPattern?: boolean;
  patternSrc?: string;
  /**
   * Trailing “more” affordance — visible on hover, focus-visible, and when `active` / expanded (matches Figma).
   */
  showMore?: boolean;
  /** Open / pressed visual state — stronger border (Figma Active). */
  active?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  id?: string;
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

export function DropdownField({
  label,
  value,
  showPattern = false,
  patternSrc = DEFAULT_PATTERN,
  showMore = false,
  active = false,
  className = "",
  disabled = false,
  onClick,
  id,
  "aria-label": ariaLabel,
  "aria-expanded": ariaExpanded,
  "aria-haspopup": ariaHaspopup,
}: DropdownFieldProps) {
  const expanded = ariaExpanded === true;
  const showActive = active || expanded;

  const rootClass = [
    "dropdown-field",
    showActive ? "dropdown-field--active" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      id={id}
      className={rootClass}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel ?? `${label}: ${value}`}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
      data-figma-file-key={FIGMA_DROPDOWN_FIELD.fileKey}
      data-figma-node-id={FIGMA_DROPDOWN_FIELD.nodeId}
    >
      <span className="dropdown-field__label">
        <span className="dropdown-field__label-text">{label}</span>
      </span>
      <span className="dropdown-field__control">
        {showPattern ? (
          <span className="dropdown-field__pattern" aria-hidden>
            <img
              src={patternSrc}
              alt=""
              className="dropdown-field__pattern-img"
              width={64}
              height={40}
              draggable={false}
            />
          </span>
        ) : null}
        <span className="dropdown-field__value-row">
          <span className="dropdown-field__value">{value}</span>
          <span className="dropdown-field__chevron">
            <ChevronDownIcon />
          </span>
        </span>
        {showMore ? (
          <span className="dropdown-field__more">
            <DotsVerticalIcon />
          </span>
        ) : null}
      </span>
    </button>
  );
}
