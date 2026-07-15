import { FigmaIcon } from "../../icons";

import "./CompoundButton.css";

/**
 * Figma 2663:1619 — Compound (split) button: brand main action plus a
 * chevron section for related options, separated by a hairline.
 */
export type CompoundButtonProps = {
  label: string;
  onClick?: () => void;
  onMenuClick?: () => void;
  /** Accessible name of the chevron section. */
  menuLabel?: string;
  disabled?: boolean;
};

export function CompoundButton({
  label,
  onClick,
  onMenuClick,
  menuLabel = "More options",
  disabled,
}: CompoundButtonProps) {
  return (
    <div className="compound-button">
      <button
        type="button"
        className="compound-button__main"
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </button>
      <span className="compound-button__separator" aria-hidden />
      <button
        type="button"
        className="compound-button__menu"
        aria-label={menuLabel}
        onClick={onMenuClick}
        disabled={disabled}
      >
        <FigmaIcon name="chevron-down" size={16} />
      </button>
    </div>
  );
}
