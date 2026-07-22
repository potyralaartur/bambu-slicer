import "./Switch.css";

const SWITCH_KNOB_URL = `${import.meta.env.BASE_URL}assets/settings/switch-knob.svg`;

export type SwitchProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
};

/** Figma 36:1955 / 36:1958 — 32×20 toggle, green track when on. */
export function Switch({ checked, onChange, disabled, "aria-label": ariaLabel }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      className={["switch", checked ? "switch--on" : ""].filter(Boolean).join(" ")}
      onClick={() => onChange?.(!checked)}
    >
      <span className="switch__knob" aria-hidden="true">
        <img className="switch__knob-image" src={SWITCH_KNOB_URL} alt="" />
      </span>
    </button>
  );
}
