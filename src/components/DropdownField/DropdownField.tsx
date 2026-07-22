import { useEffect, useRef } from "react";

import { getPatternIconUrl } from "./patternIconUrls";
import "./DropdownField.css";

/**
 * Figma: **Dropdown Field** component (main component set) + Pattern swatch variant.
 *
 * @see https://www.figma.com/design/0H1HmDgMDUddD0yCXV0WJj/Bambu-Slicer?node-id=2737-8122
 *
 * States map to CSS: resting (no stroke), hover (Border/Base/Tertiary hover),
 * active/open (Content/Base/Secondary border). Fill stays transparent.
 */
const FIGMA_DROPDOWN_FIELD = {
  fileKey: "0H1HmDgMDUddD0yCXV0WJj",
  nodeId: "2737:8122",
} as const;

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
  /**
   * Choices for the built-in expanded overlay. When provided and the field is
   * expanded, a listbox overlays the field: selected option on top (with the
   * chevron flipped), remaining options below.
   */
  options?: readonly string[];
  /** Called with the picked option when the user selects one from the overlay. */
  onSelect?: (option: string) => void;
  /** Optional 20×20 pattern preview (Figma “Pattern” slot). */
  showPattern?: boolean;
  /** Optional override for the currently selected value's mapped artwork. */
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
  options,
  onSelect,
  showPattern = false,
  patternSrc,
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
  const wrapRef = useRef<HTMLDivElement>(null);
  const expanded = ariaExpanded === true;
  const showActive = active || expanded;
  const showMenu = expanded && !disabled && (options?.length ?? 0) > 0;
  // Selected option first, remaining options listed below it.
  const menuOptions = showMenu
    ? [value, ...options!.filter((option) => option !== value)]
    : [];

  useEffect(() => {
    if (!expanded || disabled) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (wrapRef.current?.contains(event.target as Node)) return;

      // Keep the dismissing press from focusing or pressing the control behind
      // the open menu. The following click is consumed separately below.
      event.preventDefault();
      event.stopPropagation();
    };

    const handleClick = (event: MouseEvent) => {
      if (wrapRef.current?.contains(event.target as Node)) return;

      event.preventDefault();
      event.stopPropagation();
      onClick?.();
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("click", handleClick, true);
    };
  }, [expanded, disabled, onClick]);

  const rootClass = [
    "dropdown-field",
    showActive ? "dropdown-field--active" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const renderPattern = (patternValue: string, srcOverride?: string) => {
    const src = srcOverride ?? getPatternIconUrl(patternValue);
    if (!showPattern || !src) return null;

    return (
      <span className="dropdown-field__pattern" aria-hidden>
        <img
          src={src}
          alt=""
          className="dropdown-field__pattern-img"
          width={20}
          height={20}
          draggable={false}
        />
      </span>
    );
  };

  const pattern = renderPattern(value, patternSrc);

  const button = (
    <button
      type="button"
      id={id}
      className={rootClass}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel ?? `${label}: ${value}`}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
      aria-hidden={showMenu ? true : undefined}
      tabIndex={showMenu ? -1 : undefined}
      data-figma-file-key={FIGMA_DROPDOWN_FIELD.fileKey}
      data-figma-node-id={FIGMA_DROPDOWN_FIELD.nodeId}
    >
      <span className="dropdown-field__label">
        <span className="dropdown-field__label-text">{label}</span>
      </span>
      <span className="dropdown-field__control">
        {pattern}
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

  return (
    <div ref={wrapRef} className="dropdown-field-wrap">
      {button}
      {showMenu ? (
        <div
          className="dropdown-field__menu"
          role="listbox"
          aria-label={ariaLabel ?? label}
        >
          <button
            type="button"
            role="option"
            aria-selected={true}
            className="dropdown-field__option dropdown-field__option--selected"
            onClick={onClick}
          >
            <span className="dropdown-field__option-label" aria-hidden>
              {label}
            </span>
            <span className="dropdown-field__option-control">
              {pattern}
              <span className="dropdown-field__option-value-row">
                <span className="dropdown-field__value">{value}</span>
                <span className="dropdown-field__chevron">
                  <ChevronDownIcon />
                </span>
              </span>
            </span>
          </button>
          <div className="dropdown-field__options-scroll" role="presentation">
            {menuOptions.slice(1).map((option) => {
              const optionPattern = renderPattern(option);
              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={false}
                  className="dropdown-field__option"
                  onClick={() => onSelect?.(option)}
                >
                  <span className="dropdown-field__option-label" aria-hidden />
                  <span className="dropdown-field__option-control dropdown-field__option-control--plain">
                    <span className="dropdown-field__option-body">
                      {optionPattern}
                      <span className="dropdown-field__option-text">{option}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
