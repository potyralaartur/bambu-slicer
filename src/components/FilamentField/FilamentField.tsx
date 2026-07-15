import "./FilamentField.css";

/**
 * Figma: **Filament Field** component.
 *
 * @see https://www.figma.com/design/0H1HmDgMDUddD0yCXV0WJj/Bambu-Slicer?node-id=2656-1157
 *
 * State and interaction mirror `DropdownField`: resting (transparent stroke),
 * hover (`Border/Base/Tertiary hover`), open/active (`Border/Base/Tertiary active`),
 * chevron stays next to the value (fixed gap, like `TextInputField`), optional “more” affordance.
 */
const FIGMA_FILAMENT_FIELD = {
  fileKey: "0H1HmDgMDUddD0yCXV0WJj",
  nodeId: "2656:1157",
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

export type FilamentSlotTone = "default" | "silver" | "black" | "white";
export type FilamentSlotBorderMode = "auto" | "light" | "dark";

export type FilamentFieldProps = {
  /** Filament / material name (e.g. “PLA Matte”). */
  value: string;
  /** Slot index shown in the leading badge (Figma default “1”). */
  slot?: string;
  /**
   * Badge fill / text colors — matches Figma **Filament Field** slot variants (2073:1592).
   * @default "default"
   */
  slotTone?: FilamentSlotTone;
  /**
   * Optional slot chip fill color. When provided, this color is used instead of the preset tone background.
   */
  slotColor?: string;
  /**
   * Slot border contrast mode.
   * - `auto`: choose light/dark border from swatch luminance
   * - `light`: force light border
   * - `dark`: force dark border
   * @default "auto"
   */
  slotBorderMode?: FilamentSlotBorderMode;
  /**
   * Trailing “more” affordance — visible on hover, focus-visible, and when `active` / expanded (matches Figma).
   * @default true
   */
  showMore?: boolean;
  /** Open / pressed visual state — tertiary active border (Figma Active). */
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

const SLOT_TONE_CLASS: Record<FilamentSlotTone, string> = {
  default: "",
  silver: "filament-field__slot--silver",
  black: "filament-field__slot--black",
  white: "filament-field__slot--white",
};

const SLOT_TONE_HEX: Record<FilamentSlotTone, string> = {
  default: "#44474A",
  silver: "#9D9DA0",
  black: "#111314",
  white: "#FEFFFF",
};

function parseHexColor(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.trim().replace(/^#/, "");

  if (normalized.length === 3) {
    const expanded = normalized
      .split("")
      .map((char) => char + char)
      .join("");
    const value = Number.parseInt(expanded, 16);
    if (Number.isNaN(value)) {
      return null;
    }
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
    };
  }

  if (normalized.length !== 6) {
    return null;
  }

  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) {
    return null;
  }

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function toLinearSrgb(channel: number) {
  const value = channel / 255;
  return value <= 0.04045
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
}

function isLightColor(hex: string): boolean | null {
  const rgb = parseHexColor(hex);
  if (!rgb) {
    return null;
  }

  const luminance =
    0.2126 * toLinearSrgb(rgb.r) +
    0.7152 * toLinearSrgb(rgb.g) +
    0.0722 * toLinearSrgb(rgb.b);

  return luminance > 0.5;
}

function getSlotBorderClass(
  mode: FilamentSlotBorderMode,
  slotTone: FilamentSlotTone,
  slotColor?: string,
) {
  if (mode === "light") {
    return "filament-field__slot--border-light";
  }
  if (mode === "dark") {
    return "filament-field__slot--border-dark";
  }

  const resolvedColor = slotColor ?? SLOT_TONE_HEX[slotTone];
  const light = isLightColor(resolvedColor);
  if (light === null) {
    return "filament-field__slot--border-light";
  }
  return light
    ? "filament-field__slot--border-dark"
    : "filament-field__slot--border-light";
}

export function FilamentField({
  value,
  slot = "1",
  slotTone = "default",
  slotColor,
  slotBorderMode = "auto",
  showMore = true,
  active = false,
  className = "",
  disabled = false,
  onClick,
  id,
  "aria-label": ariaLabel,
  "aria-expanded": ariaExpanded,
  "aria-haspopup": ariaHaspopup,
}: FilamentFieldProps) {
  const expanded = ariaExpanded === true;
  const showActive = active || expanded;

  const slotClass = [
    "filament-field__slot",
    SLOT_TONE_CLASS[slotTone],
    getSlotBorderClass(slotBorderMode, slotTone, slotColor),
  ]
    .filter(Boolean)
    .join(" ");

  const slotStyle = slotColor ? { backgroundColor: slotColor } : undefined;

  const rootClass = [
    "filament-field",
    showActive ? "filament-field--active" : "",
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
      aria-label={ariaLabel ?? `Filament slot ${slot}: ${value}`}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
      data-figma-file-key={FIGMA_FILAMENT_FIELD.fileKey}
      data-figma-node-id={FIGMA_FILAMENT_FIELD.nodeId}
    >
      <span className={slotClass} style={slotStyle} aria-hidden>
        {slot}
      </span>
      <span className="filament-field__control">
        <span className="filament-field__value-row">
          <span className="filament-field__value">{value}</span>
          <span className="filament-field__chevron">
            <ChevronDownIcon />
          </span>
        </span>
        {showMore ? (
          <span className="filament-field__more">
            <DotsVerticalIcon />
          </span>
        ) : null}
      </span>
    </button>
  );
}
