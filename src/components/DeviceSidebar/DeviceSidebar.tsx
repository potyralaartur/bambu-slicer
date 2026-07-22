import { useEffect, useId, useRef, useState } from "react";

import { Button } from "../Button/Button";
import { DeviceMotionControls } from "../DeviceMotionControls/DeviceMotionControls";
import { DropdownField } from "../DropdownField/DropdownField";
import {
  FanControlPopover,
  type FanControlState,
} from "../FanControlPopover/FanControlPopover";
import { IconButton } from "../IconButton/IconButton";
import { SectionHeader as CollapsibleSectionHeader } from "../SectionHeader/SectionHeader";
import { FigmaIcon } from "../../icons";

import "./DeviceSidebar.css";

const ASSET_BASE = `${import.meta.env.BASE_URL}assets/device/`;

type SectionHeaderProps = {
  title: string;
  status?: string;
  actionLabel?: string;
};

function DeviceHeader({ title, status, actionLabel }: SectionHeaderProps) {
  return (
    <div className="device-section-header">
      <h2>{title}</h2>
      {(status || actionLabel) && (
        <div className="device-section-header__actions">
          {status && (
            <span className="device-status-pill">
              <img src={`${ASSET_BASE}status-dot.svg`} alt="" />
              <span>{status}</span>
            </span>
          )}
          {actionLabel && (
            <IconButton aria-label={actionLabel}>
              <FigmaIcon name="gear" size={20} />
            </IconButton>
          )}
        </div>
      )}
    </div>
  );
}

type StatRowProps = {
  label: string;
  current?: string;
  value: string;
  unit?: string;
  min?: number;
  max?: number;
  className?: string;
  inputAriaLabel?: string;
  onChange: (value: string) => void;
};

type StatIntegerValueProps = {
  label: string;
  value: string;
  unit?: string;
  min?: number;
  max?: number;
  ariaLabel?: string;
  onChange: (value: string) => void;
};

function StatIntegerValue({
  label,
  value,
  unit,
  min = 0,
  max,
  ariaLabel,
  onChange,
}: StatIntegerValueProps) {
  const commitValue = () => {
    const parsed = Number.parseInt(value, 10);
    const fallback = min;
    const integer = Number.isFinite(parsed) ? parsed : fallback;
    const clamped = Math.min(max ?? Number.POSITIVE_INFINITY, Math.max(min, integer));
    onChange(String(clamped));
  };

  return (
    <span className="device-stat-value device-stat-value--integer">
      <span className="device-stat-value__text-slot">
        <span className="device-stat-value__mirror" aria-hidden>
          {value || "0"}
        </span>
        <input
          className="device-stat-value__input"
          type="number"
          inputMode="numeric"
          step={1}
          min={min}
          max={max}
          value={value}
          aria-label={ariaLabel ?? `Set ${label}${unit ? ` in ${unit}` : ""}`}
          onChange={(event) => {
            const nextValue = event.target.value;
            if (/^\d*$/.test(nextValue)) onChange(nextValue);
          }}
          onBlur={commitValue}
          onKeyDown={(event) => {
            if (["e", "E", "+", "-", ".", ","].includes(event.key)) {
              event.preventDefault();
            }
          }}
        />
      </span>
    </span>
  );
}

function StatRow({ label, current, value, unit, min, max, className = "", inputAriaLabel, onChange }: StatRowProps) {
  const rootClass = [
    "device-stat-row",
    current === undefined ? "device-stat-row--single" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={rootClass}
      onClick={(event) => {
        const control = event.currentTarget.querySelector<HTMLInputElement>(
          ".device-stat-value__input",
        );

        if (!control || control.contains(event.target as Node)) return;

        control.focus();
        control.select();
      }}
    >
      <span className="device-stat-row__label">{label}</span>
      <span className="device-stat-row__value">
        {current !== undefined && (
          <span className="device-stat-row__current">
            <span>{current}</span>
            <span>/</span>
          </span>
        )}
        <StatIntegerValue
          label={label}
          value={value}
          unit={unit}
          min={min}
          max={max}
          ariaLabel={inputAriaLabel}
          onChange={onChange}
        />
        {unit && <span className="device-stat-row__unit">{unit}</span>}
      </span>
    </div>
  );
}

type FansStatRowProps = {
  value: FanControlState;
  onChange: (value: FanControlState) => void;
};

function FansStatRow({ value, onChange }: FansStatRowProps) {
  const popoverId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const summary = Object.values(value)
    .map((fan) => fan.enabled ? `${fan.speed}%` : "Off")
    .join(" / ");

  return (
    <div className="device-stat-row-cell" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="device-stat-row device-stat-row--fans"
        aria-expanded={open}
        aria-controls={popoverId}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="device-stat-row__label">Fans</span>
        <span className="device-stat-row__value">{summary}</span>
      </button>
      {open && (
        <FanControlPopover
          id={popoverId}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}

type AmsSlot = {
  id: string;
  material: string;
  swatch: "a1" | "a2" | "a4" | "b1" | "b2" | "b3" | "b4";
  selected?: boolean;
  empty?: boolean;
};

const AMS_A: AmsSlot[] = [
  { id: "A1", material: "PLA Sparkle", swatch: "a1" },
  { id: "A2", material: "PLA Matte", swatch: "a2", selected: true },
  { id: "A3", material: "PLA Matte", swatch: "a2" },
  { id: "A4", material: "PETG", swatch: "a4" },
];

const AMS_B: AmsSlot[] = [
  { id: "B1", material: "ABS", swatch: "b1" },
  { id: "B2", material: "TPU 95A", swatch: "b2" },
  { id: "B3", material: "Empty", swatch: "b3", empty: true },
  { id: "B4", material: "PLA Basic", swatch: "b4" },
];

const PRINT_SPEED_OPTIONS = [
  "50% · Silent",
  "100% · Standard",
  "124% · Sport",
  "166% · Ludicrous",
] as const;

const EXTERNAL_SPOOL_OPTIONS = [
  "Not loaded",
  "PLA Basic",
  "PLA Matte",
  "PLA Sparkle",
  "PETG",
  "ABS",
  "TPU 95A",
] as const;

function AmsSlotCard({ slot }: { slot: AmsSlot }) {
  return (
    <div className={`device-ams-slot${slot.selected ? " is-selected" : ""}`}>
      <div className="device-ams-slot__top">
        <img src={`${ASSET_BASE}ams-${slot.swatch}.svg`} alt="" />
        <span>{slot.id}</span>
      </div>
      <span className={`device-ams-slot__material${slot.empty ? " is-empty" : ""}`}>
        {slot.material}
      </span>
      <span className="device-ams-slot__level" aria-hidden>
        {!slot.empty && <span />}
      </span>
    </div>
  );
}

function AmsUnit({ name, detail, slots }: { name: string; detail: string; slots: AmsSlot[] }) {
  return (
    <div className="device-ams-unit">
      <div className="device-ams-unit__header">
        {name} · {detail}
      </div>
      <div className="device-ams-unit__slots">
        {slots.map((slot) => <AmsSlotCard slot={slot} key={slot.id} />)}
      </div>
    </div>
  );
}

export type DeviceSidebarProps = {
  printerName?: string;
};

export function DeviceSidebar({ printerName = "Bambu Lab P1S" }: DeviceSidebarProps) {
  const temperaturesPanelId = useId();
  const amsPanelId = useId();
  const [temperaturesExpanded, setTemperaturesExpanded] = useState(true);
  const [amsExpanded, setAmsExpanded] = useState(true);
  const [showAlert, setShowAlert] = useState(true);
  const [printSpeed, setPrintSpeed] = useState<string>(PRINT_SPEED_OPTIONS[1]);
  const [printSpeedOpen, setPrintSpeedOpen] = useState(false);
  const [nozzleTarget, setNozzleTarget] = useState("220");
  const [bedTarget, setBedTarget] = useState("55");
  const [chamberTarget, setChamberTarget] = useState("38");
  const [fansValue, setFansValue] = useState<FanControlState>({
    partCooling: { enabled: true, speed: 100 },
    auxiliary: { enabled: false, speed: 50 },
    chamber: { enabled: true, speed: 30 },
  });
  const [externalSpool, setExternalSpool] = useState<string>(EXTERNAL_SPOOL_OPTIONS[0]);
  const [externalSpoolOpen, setExternalSpoolOpen] = useState(false);

  return (
    <aside className="device-sidebar" aria-label={`${printerName} status`}>
      <DeviceHeader title={printerName} status="Printing" actionLabel="Printer settings" />

      <section className="device-sidebar__section device-print-job" aria-label="Print job">
        <div className="device-print-job__summary">
          <img
            className="device-print-job__thumbnail"
            src={`${ASSET_BASE}print-job-thumbnail.png`}
            alt="Benchy print preview"
          />
          <div className="device-print-job__details">
            <strong>Benchy_v2.3mf</strong>
            <span>0.20 mm Standard · PLA Matte · Plate 1</span>
          </div>
        </div>

        <div className="device-print-job__progress">
          <div className="device-print-job__headline">
            <strong>62%</strong>
            <span>1h 24m left · ETA 16:42</span>
          </div>
          <div className="device-progress-bar" role="progressbar" aria-label="Print progress" aria-valuenow={62} aria-valuemin={0} aria-valuemax={100}>
            <span />
          </div>
          <div className="device-print-job__meta">
            <span>Layer 143 / 307</span>
            <span>Started 14:05</span>
          </div>
        </div>

        <div className="device-print-job__actions">
          <Button className="device-print-job__action" variant="secondary" color="base" leftIcon={false} rightIcon={false}>
            Pause
          </Button>
          <Button className="device-print-job__action" variant="secondary" color="danger" leftIcon={false} rightIcon={false}>
            Stop
          </Button>
        </div>

        <div className="device-print-job__speed">
          <DropdownField
            label="Print speed"
            value={printSpeed}
            options={PRINT_SPEED_OPTIONS}
            active={printSpeedOpen}
            aria-expanded={printSpeedOpen}
            aria-haspopup="listbox"
            onClick={() => setPrintSpeedOpen((open) => !open)}
            onSelect={(option) => {
              setPrintSpeed(option);
              setPrintSpeedOpen(false);
            }}
          />
        </div>
      </section>

      <section
        className={[
          "device-sidebar__section",
          "device-temperatures",
          !temperaturesExpanded ? "device-temperatures--collapsed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="Temperatures"
      >
        <CollapsibleSectionHeader
          title="Temperatures"
          collapsible
          expanded={temperaturesExpanded}
          onToggle={() => setTemperaturesExpanded((open) => !open)}
          panelId={temperaturesPanelId}
          showTrailingAction={false}
          ariaLabel="Temperatures section"
        />
        <div
          id={temperaturesPanelId}
          className="device-temperatures__rows"
          hidden={!temperaturesExpanded}
        >
          <StatRow label="Nozzle" current="220" value={nozzleTarget} unit="°C" min={0} max={300} onChange={setNozzleTarget} />
          <StatRow label="Nozzle" current="55" value={bedTarget} unit="°C" min={0} max={120} inputAriaLabel="Set bed temperature in °C" onChange={setBedTarget} />
          <StatRow label="Chamber" current="38" value={chamberTarget} unit="°C" min={0} max={60} onChange={setChamberTarget} />
          <FansStatRow value={fansValue} onChange={setFansValue} />
        </div>
      </section>

      <DeviceMotionControls />

      <section
        className={[
          "device-sidebar__section",
          "device-ams",
          !amsExpanded ? "device-ams--collapsed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="AMS - all units"
      >
        <CollapsibleSectionHeader
          title="AMS - all units"
          collapsible
          expanded={amsExpanded}
          onToggle={() => setAmsExpanded((open) => !open)}
          panelId={amsPanelId}
          showTrailingAction={false}
          ariaLabel="AMS section"
          endSlot={
            <IconButton aria-label="AMS settings">
              <FigmaIcon name="gear" size={20} />
            </IconButton>
          }
        />
        <div id={amsPanelId} className="device-ams__panel" hidden={!amsExpanded}>
          <AmsUnit name="AMS A" detail="28% RH · Drying off" slots={AMS_A} />
          <AmsUnit name="AMS B" detail="28% RH" slots={AMS_B} />
          <div className="device-ams__external">
            <DropdownField
              label="External spool"
              value={externalSpool}
              options={EXTERNAL_SPOOL_OPTIONS}
              active={externalSpoolOpen}
              aria-expanded={externalSpoolOpen}
              aria-haspopup="listbox"
              onClick={() => setExternalSpoolOpen((open) => !open)}
              onSelect={(option) => {
                setExternalSpool(option);
                setExternalSpoolOpen(false);
              }}
            />
          </div>

          <div className="device-alert-slot">
            {showAlert && (
              <article className="device-alert" aria-label="AMS A2 filament may run out">
                <div className="device-alert__head">
                  <span className="device-alert__warning-icon" aria-hidden>
                    <img src={`${ASSET_BASE}warning-triangle.svg`} alt="" />
                  </span>
                  <h3>AMS A2 filament may run out</h3>
                  <IconButton aria-label="Dismiss filament warning" onClick={() => setShowAlert(false)}>
                    <FigmaIcon name="x-close" size={20} />
                  </IconButton>
                </div>
                <div className="device-alert__body">
                  <p>
                    About 12 g remain and this job needs ~34 g from slot A3. Pause and swap the spool, or map slot A3 (same PLA Matte) as backup.
                  </p>
                  <div className="device-alert__actions">
                    <Button variant="primary" color="warning" leftIcon={false} rightIcon={false}>
                      Use A3 as backup
                    </Button>
                    <Button variant="secondary" color="base" leftIcon={false} rightIcon={false}>
                      Swap spool guide
                    </Button>
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>

    </aside>
  );
}
