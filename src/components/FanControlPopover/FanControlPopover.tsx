import { IconButton } from "../IconButton/IconButton";
import { FigmaIcon } from "../../icons";

import "./FanControlPopover.css";

export type FanChannel = {
  enabled: boolean;
  speed: number;
};

export type FanControlState = {
  partCooling: FanChannel;
  auxiliary: FanChannel;
  chamber: FanChannel;
};

type FanControlPopoverProps = {
  id: string;
  value: FanControlState;
  onChange: (value: FanControlState) => void;
};

const TOGGLE_ASSET_BASE = `${import.meta.env.BASE_URL}assets/device/`;

const FAN_ROWS = [
  {
    key: "partCooling",
    label: "Part cooling",
    rowNodeId: "9173:5766",
    labelNodeId: "9173:5767",
    valueNodeId: "9173:5772",
    toggleNodeId: "9173:5775",
  },
  {
    key: "auxiliary",
    label: "Auxiliary",
    rowNodeId: "9173:5777",
    labelNodeId: "9173:5778",
    valueNodeId: "9173:5783",
    toggleNodeId: "9173:5786",
  },
  {
    key: "chamber",
    label: "Chamber",
    rowNodeId: "9173:5788",
    labelNodeId: "9173:5789",
    valueNodeId: "9173:5794",
    toggleNodeId: "9173:5797",
  },
] as const;

export function FanControlPopover({ id, value, onChange }: FanControlPopoverProps) {
  const updateChannel = (
    key: (typeof FAN_ROWS)[number]["key"],
    patch: Partial<FanChannel>,
  ) => {
    onChange({
      ...value,
      [key]: {
        ...value[key],
        ...patch,
      },
    });
  };

  return (
    <div
      id={id}
      className="fan-control-popover"
      role="dialog"
      aria-label="Fan settings"
      data-node-id="9173:5760"
    >
      <div className="fan-control-popover__rows" data-node-id="9173:5765">
        {FAN_ROWS.map((row) => {
          const channel = value[row.key];
          const displayValue = channel.enabled ? `${channel.speed}%` : "Off";

          return (
            <div
              className="fan-control-popover__row"
              data-node-id={row.rowNodeId}
              key={row.key}
            >
              <span
                className="fan-control-popover__label"
                data-node-id={row.labelNodeId}
              >
                {row.label}
              </span>

              <div className="fan-control-popover__stepper">
                <IconButton
                  aria-label={`Decrease ${row.label.toLowerCase()} fan speed`}
                  disabled={!channel.enabled || channel.speed <= 0}
                  onClick={() => updateChannel(row.key, {
                    speed: Math.max(0, channel.speed - 10),
                  })}
                >
                  <FigmaIcon name="minus" size={20} />
                </IconButton>
                <span
                  className={[
                    "fan-control-popover__value",
                    !channel.enabled ? "fan-control-popover__value--off" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  data-node-id={row.valueNodeId}
                >
                  {displayValue}
                </span>
                <IconButton
                  aria-label={`Increase ${row.label.toLowerCase()} fan speed`}
                  disabled={!channel.enabled || channel.speed >= 100}
                  onClick={() => updateChannel(row.key, {
                    speed: Math.min(100, channel.speed + 10),
                  })}
                >
                  <FigmaIcon name="plus" size={20} />
                </IconButton>
              </div>

              <button
                type="button"
                className="fan-control-popover__toggle"
                role="switch"
                aria-checked={channel.enabled}
                aria-label={`${row.label} fan`}
                data-node-id={row.toggleNodeId}
                onClick={() => updateChannel(row.key, {
                  enabled: !channel.enabled,
                })}
              >
                <img
                  src={`${TOGGLE_ASSET_BASE}fan-toggle-${channel.enabled ? "on" : "off"}.svg`}
                  alt=""
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="fan-control-popover__divider" data-node-id="9173:5799" />
      <div className="fan-control-popover__hint" data-node-id="9173:5800">
        <p data-node-id="9173:5801">
          Changing fan speeds during a print may affect quality.
        </p>
      </div>
    </div>
  );
}
