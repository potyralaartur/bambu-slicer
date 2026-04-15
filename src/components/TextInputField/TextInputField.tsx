import { useId, useRef } from "react";

import "./TextInputField.css";

/** Small / large step from a reference numeric string (e.g. `5` → 1 / 10, `0.150` → 0.001 / 0.01). */
export function getArrowStepsFromReference(reference: string): { small: number; large: number } | null {
  const t = reference.trim().replace(",", ".");
  if (!/^-?\d+(\.\d*)?$/.test(t)) return null;
  const dot = t.indexOf(".");
  const decimalPlaces = dot === -1 ? 0 : t.length - dot - 1;
  const small = 10 ** -decimalPlaces;
  return { small, large: small * 10 };
}

function parseFieldNumber(raw: string): number | null {
  const t = raw.trim().replace(",", ".");
  if (t === "" || t === "-" || t === "." || t === "-.") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Format `n` using the same decimal precision as `referenceForSteps` (including trailing zeros). */
export function formatNumberLikeReference(n: number, referenceForSteps: string): string {
  const t = referenceForSteps.trim().replace(",", ".");
  const dot = t.indexOf(".");
  const decimalPlaces = dot === -1 ? 0 : t.length - dot - 1;
  if (decimalPlaces === 0) {
    return String(Math.round(n));
  }
  return n.toFixed(decimalPlaces);
}

/**
 * Figma: **Text input field** (label + value + optional unit).
 *
 * @see https://www.figma.com/design/0H1HmDgMDUddD0yCXV0WJj/Bambu-Slicer?node-id=36-60
 *
 * Border / hover / focus behavior matches `DropdownField`: resting transparent stroke,
 * hover `Border/Base/Tertiary hover`, focused stroke matches `dropdown-field--active`
 * (`Content/Base/Secondary`) for pointer and keyboard alike.
 * Value and unit stay a fixed 4px apart (`gap` on `text-input-field__value-row`).
 * No field fill (transparent row on the panel).
 */
const FIGMA_TEXT_INPUT_FIELD = {
  fileKey: "0H1HmDgMDUddD0yCXV0WJj",
  nodeId: "36:60",
} as const;

export type TextInputFieldProps = {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  /**
   * Optional string used only to derive arrow-key step sizes (decimal places / magnitude).
   * When omitted, the current `value` is used — use this prop to lock steps to a profile default
   * while the user edits the field.
   */
  incrementReference?: string;
  /** Trailing suffix (e.g. `mm`). Hidden when `showUnit` is false. */
  unit?: string;
  showUnit?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className" | "id" | "value" | "onChange" | "size"
>;

export function TextInputField({
  label,
  value,
  onChange,
  incrementReference,
  unit = "mm",
  showUnit = true,
  disabled = false,
  className = "",
  id: idProp,
  ...inputProps
}: TextInputFieldProps) {
  const reactId = useId();
  const inputId = idProp ?? `text-input-field-${reactId}`;
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    onKeyDown: onKeyDownFromProps,
    inputMode,
    type: inputType,
    ...restInputProps
  } = inputProps;

  const numericArrowStepsEnabled =
    inputMode === "decimal" || inputMode === "numeric" || inputType === "number";

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    onKeyDownFromProps?.(e);
    if (e.defaultPrevented) return;
    if (disabled || !numericArrowStepsEnabled) return;
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    if (e.altKey || e.metaKey || e.ctrlKey) return;

    const refForSteps = (incrementReference ?? value).trim();
    const steps = getArrowStepsFromReference(refForSteps);
    if (!steps) return;

    const current = parseFieldNumber(value);
    const base = current === null ? 0 : current;
    const delta = e.shiftKey ? steps.large : steps.small;
    const nextNum = base + (e.key === "ArrowUp" ? delta : -delta);

    e.preventDefault();

    const nextStr = formatNumberLikeReference(nextNum, refForSteps);
    onChange({
      target: { value: nextStr } as HTMLInputElement,
      currentTarget: { value: nextStr } as HTMLInputElement,
    } as React.ChangeEvent<HTMLInputElement>);

    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) {
        const len = nextStr.length;
        el.setSelectionRange(len, len);
      }
    });
  };

  const rootClass = ["text-input-field", disabled ? "text-input-field--disabled" : "", className]
    .filter(Boolean)
    .join(" ");

  const describedBy = [
    typeof inputProps["aria-describedby"] === "string" ? inputProps["aria-describedby"] : "",
    showUnit ? `${inputId}-unit` : "",
  ]
    .filter(Boolean)
    .join(" ");

  /* Override the HTML default `size=20` so resting width follows the value (still capped by CSS). */
  const sizeByContent = Math.max(value.length, 1);

  return (
    <div
      className={rootClass}
      data-figma-file-key={FIGMA_TEXT_INPUT_FIELD.fileKey}
      data-figma-node-id={FIGMA_TEXT_INPUT_FIELD.nodeId}
    >
      <label htmlFor={inputId} className="text-input-field__label">
        <span className="text-input-field__label-text">{label}</span>
      </label>
      <div
        className="text-input-field__value"
        onPointerDown={(e) => {
          if (disabled) return;
          if (e.target === inputRef.current) return;
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <div className="text-input-field__value-row">
          <input
            ref={inputRef}
            id={inputId}
            className="text-input-field__input"
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            size={sizeByContent}
            {...restInputProps}
            aria-describedby={describedBy || undefined}
          />
          {showUnit ? (
            <span id={`${inputId}-unit`} className="text-input-field__unit">
              {unit}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
