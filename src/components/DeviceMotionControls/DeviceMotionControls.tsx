import { useId, useState } from "react";

import { SectionHeader } from "../SectionHeader/SectionHeader";

import "./DeviceMotionControls.css";

const ASSET_BASE = `${import.meta.env.BASE_URL}assets/device/`;

type DpadDirection = "up" | "left" | "down" | "right";
type DpadRing = "outer" | "inner";

type DpadAction = {
  ring: DpadRing;
  direction: DpadDirection;
  label: string;
  announcement: string;
};

const DPAD_ACTIONS: readonly DpadAction[] = [
  { ring: "outer", direction: "up", label: "Move Y plus 10 millimeters", announcement: "Y plus 10 millimeter move requested." },
  { ring: "outer", direction: "left", label: "Move X minus 10 millimeters", announcement: "X minus 10 millimeter move requested." },
  { ring: "outer", direction: "down", label: "Move Y minus 10 millimeters", announcement: "Y minus 10 millimeter move requested." },
  { ring: "outer", direction: "right", label: "Move X plus 10 millimeters", announcement: "X plus 10 millimeter move requested." },
  { ring: "inner", direction: "up", label: "Move Y plus 1 millimeter", announcement: "Y plus 1 millimeter move requested." },
  { ring: "inner", direction: "left", label: "Move X minus 1 millimeter", announcement: "X minus 1 millimeter move requested." },
  { ring: "inner", direction: "down", label: "Move Y minus 1 millimeter", announcement: "Y minus 1 millimeter move requested." },
  { ring: "inner", direction: "right", label: "Move X plus 1 millimeter", announcement: "X plus 1 millimeter move requested." },
];

type MotionButton = {
  label: string;
  announcement: string;
  icon: "single" | "double";
  direction: "up" | "down";
};

const BED_ACTIONS: readonly MotionButton[] = [
  { label: "Move bed up 10 millimeters", announcement: "Bed up 10 millimeter move requested.", icon: "double", direction: "up" },
  { label: "Move bed up 1 millimeter", announcement: "Bed up 1 millimeter move requested.", icon: "single", direction: "up" },
  { label: "Move bed down 1 millimeter", announcement: "Bed down 1 millimeter move requested.", icon: "single", direction: "down" },
  { label: "Move bed down 10 millimeters", announcement: "Bed down 10 millimeter move requested.", icon: "double", direction: "down" },
];

const EXTRUDER_ACTIONS: readonly MotionButton[] = [
  { label: "Retract filament 10 millimeters", announcement: "Filament retraction requested.", icon: "single", direction: "up" },
  { label: "Extrude filament 10 millimeters", announcement: "Filament extrusion requested.", icon: "single", direction: "down" },
];

function MotionButtonStack({
  title,
  actions,
  onActivate,
}: {
  title: string;
  actions: readonly MotionButton[];
  onActivate: (message: string) => void;
}) {
  return (
    <div className="device-motion-controls__column">
      <span className="device-motion-controls__column-label">{title}</span>
      <div className="device-motion-controls__button-stack">
        {actions.map((action) => (
          <button
            className="device-motion-controls__button"
            type="button"
            aria-label={action.label}
            key={action.label}
            onClick={() => onActivate(action.announcement)}
          >
            <span className="device-motion-controls__button-icon" aria-hidden>
              <img
                className={action.direction === "down" ? "is-down" : ""}
                src={`${ASSET_BASE}dpad-chevron-${action.icon}.svg`}
                alt=""
              />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function DeviceMotionControls() {
  const controlsPanelId = useId();
  const [sectionExpanded, setSectionExpanded] = useState(true);
  const [announcement, setAnnouncement] = useState({ message: "", sequence: 0 });

  const announce = (message: string) => {
    setAnnouncement((current) => ({
      message,
      sequence: current.sequence + 1,
    }));
  };

  return (
    <section
      className={[
        "device-sidebar__section",
        "device-motion-controls",
        !sectionExpanded ? "device-motion-controls--collapsed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Controls"
    >
      <SectionHeader
        title="Controls"
        collapsible
        expanded={sectionExpanded}
        onToggle={() => setSectionExpanded((open) => !open)}
        panelId={controlsPanelId}
        showTrailingAction={false}
        ariaLabel="Controls section"
      />

      <div id={controlsPanelId} className="device-motion-controls__panel" hidden={!sectionExpanded}>
        <div className="device-motion-controls__jog">
          <div className="device-dpad" role="group" aria-label="XY movement">
            {DPAD_ACTIONS.map((action) => (
              <button
                className={`device-dpad__sector device-dpad__sector--${action.ring} device-dpad__sector--${action.direction}`}
                type="button"
                aria-label={action.label}
                key={`${action.ring}-${action.direction}`}
                onClick={() => announce(action.announcement)}
              />
            ))}

            <span className="device-dpad__inner-ring" aria-hidden />
            <span className="device-dpad__separator device-dpad__separator--forward" aria-hidden />
            <span className="device-dpad__separator device-dpad__separator--backward" aria-hidden />

            <span className="device-dpad__axis-label device-dpad__axis-label--up" aria-hidden>Y</span>
            <span className="device-dpad__axis-label device-dpad__axis-label--left" aria-hidden>-X</span>
            <span className="device-dpad__axis-label device-dpad__axis-label--right" aria-hidden>X</span>
            <span className="device-dpad__axis-label device-dpad__axis-label--down" aria-hidden>-Y</span>

            <span className="device-dpad__step-label device-dpad__step-label--plus-ten" aria-hidden>
              <span className="device-dpad__step-label-text">+10</span>
            </span>
            <span className="device-dpad__step-label device-dpad__step-label--plus-one" aria-hidden>
              <span className="device-dpad__step-label-text">+1</span>
            </span>
            <span className="device-dpad__step-label device-dpad__step-label--minus-one" aria-hidden>
              <span className="device-dpad__step-label-text">-1</span>
            </span>
            <span className="device-dpad__step-label device-dpad__step-label--minus-ten" aria-hidden>
              <span className="device-dpad__step-label-text">-10</span>
            </span>

            <button
              className="device-dpad__home"
              type="button"
              aria-label="Auto home printer axes"
              onClick={() => announce("Auto homing confirmation requested.")}
            >
              <span className="device-dpad__home-icon" aria-hidden>
                <img src={`${ASSET_BASE}dpad-home.svg`} alt="" />
              </span>
            </button>
          </div>

          <MotionButtonStack title="Bed" actions={BED_ACTIONS} onActivate={announce} />
          <MotionButtonStack title="Extruder" actions={EXTRUDER_ACTIONS} onActivate={announce} />
        </div>

        <p className="device-motion-controls__announcement" role="status" aria-live="polite" aria-atomic="true">
          {announcement.message}
          {announcement.sequence > 0 ? ` Command ${announcement.sequence}.` : ""}
        </p>
      </div>
    </section>
  );
}
