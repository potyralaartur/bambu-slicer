import type { ReactNode } from "react";

import { FigmaIcon } from "../../icons";
import {
  formatNumberLikeReference,
  getArrowStepsFromReference,
  sanitizeNumericInput,
} from "../TextInputField/TextInputField";

import "./SettingRow.css";

export type SettingRowProps = {
  title: string;
  description?: string;
  /** Right-aligned control: Switch, SelectControl, StatusIndicator, value, link… */
  control?: ReactNode;
  /** When set, the whole row is a button (drill-in rows, Figma 9434:9324). */
  onClick?: () => void;
};

/** Figma 8940:2436 (Setting Row) — info column + trailing control. */
export function SettingRow({ title, description, control, onClick }: SettingRowProps) {
  const content = (
    <>
      <div className="setting-row__info">
        <p className="setting-row__title">{title}</p>
        {description ? <p className="setting-row__description">{description}</p> : null}
      </div>
      {control ? <div className="setting-row__control">{control}</div> : null}
    </>
  );

  if (onClick) {
    return (
      <button type="button" className="setting-row setting-row--clickable" onClick={onClick}>
        {content}
      </button>
    );
  }
  return <div className="setting-row">{content}</div>;
}

/** Figma 8940:2440 (Control, type=Value) — plain read-only value text. */
export function SettingValue({ children }: { children: ReactNode }) {
  return <span className="setting-row__value">{children}</span>;
}

/** Figma 8969:3792 (Control, type=Link) — brand-colored underlined action. */
export function SettingLink({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button type="button" className="setting-row__link" onClick={onClick}>
      {children}
    </button>
  );
}

/** Figma 8940:2440 (Control, type=Disclosure) — value text + 24px right chevron. */
export function SettingDisclosure({ children }: { children: ReactNode }) {
  return (
    <span className="setting-row__disclosure">
      <span className="setting-row__value">{children}</span>
      <FigmaIcon
        name="chevron-right-small"
        size={24}
        className="setting-row__disclosure-chevron"
      />
    </span>
  );
}

export type SettingNumberInputProps = {
  value: string;
  onChange: (value: string) => void;
  /** Locks arrow-key step size / formatting to a reference value (usually the initial one). */
  incrementReference?: string;
  "aria-label"?: string;
};

/**
 * Figma 9039:2837 (Control, type=Number input) — compact 24px inline numeric field.
 * Hover/focus borders follow the TextInputField / DropdownField convention.
 */
export function SettingNumberInput({
  value,
  onChange,
  incrementReference,
  "aria-label": ariaLabel,
}: SettingNumberInputProps) {
  const reference = incrementReference ?? value;

  const step = (direction: 1 | -1, large: boolean) => {
    const steps = getArrowStepsFromReference(reference);
    if (!steps) return;
    const current = Number(value.trim().replace(",", "."));
    const base = Number.isFinite(current) ? current : 0;
    const next = base + direction * (large ? steps.large : steps.small);
    onChange(formatNumberLikeReference(next, reference));
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      className="setting-row__number-input"
      value={value}
      size={Math.max(value.length, 1)}
      aria-label={ariaLabel}
      onChange={(event) => onChange(sanitizeNumericInput(event.target.value, true))}
      onKeyDown={(event) => {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          event.preventDefault();
          step(event.key === "ArrowUp" ? 1 : -1, event.shiftKey);
        }
      }}
    />
  );
}
