import { FigmaIcon } from "../../../icons";
import { CodeBlock } from "../../CodeBlock/CodeBlock";
import { SettingLink, SettingRow } from "../../SettingRow/SettingRow";
import { SettingsCard } from "../../SettingsCard/SettingsCard";
import { StatusIndicator } from "../../StatusIndicator/StatusIndicator";
import type { PageConfig, RowConfig } from "../types";

const START_GCODE = [
  ";===== machine: Bambu Lab P1S =====================",
  "G90                          ; absolute positioning",
  "M83                          ; relative extrusion",
  "M140 S[bed_temperature_initial_layer]",
  "M104 S[nozzle_temperature_initial_layer]",
  "G28                          ; home all axes",
  "M970 Q1 A7 B30 C80 H15 K0    ; vibration compensation",
  "G29                          ; auto bed leveling",
  "M109 S[nozzle_temperature_initial_layer]",
  "G1 Z0.2 F300                 ; move to start position",
  "⋯ 204 more lines",
] as const;

const PRESET_ROWS: RowConfig[] = [
  {
    title: "Bambu Lab P1S 0.4 nozzle",
    description: "0.4 mm nozzle · System default",
    control: { kind: "disclosure", text: "System" },
    onClick: () => {},
  },
  {
    title: "Bambu Lab P1S 0.2 nozzle",
    description: "0.2 mm nozzle",
    control: { kind: "disclosure", text: "System" },
    onClick: () => {},
  },
  {
    title: "Bambu Lab P1S 0.6 nozzle",
    description: "0.6 mm nozzle",
    control: { kind: "disclosure", text: "System" },
    onClick: () => {},
  },
  {
    title: "Bambu Lab P1S 0.8 nozzle",
    description: "0.8 mm nozzle",
    control: { kind: "disclosure", text: "System" },
    onClick: () => {},
  },
  {
    title: "P1S · 0.4 (tuned)",
    description: "0.4 mm nozzle · Based on Bambu Lab P1S",
    control: { kind: "disclosure", text: "User" },
    onClick: () => {},
  },
];

/**
 * Bambu Lab P1S printer detail — Figma 9425:6663 (Printer Settings).
 * Drill-in from the Printers page; not part of the top-level `SETTINGS_PAGES`.
 */
export const PRINTER_DETAIL_PAGE: PageConfig = {
  id: "printer-p1s",
  label: "Bambu Lab P1S",
  icon: "printer",
  title: "Bambu Lab P1S",
  subtitle: "P1S · 0.4 mm nozzle · Firmware 01.08.02.00",
  headerAside: () => <StatusIndicator label="Printing · 62%" size="large" />,
  sections: [
    {
      id: "printer-presets",
      title: "Printer presets",
      description: "Select a preset to edit it. Duplicates are saved as user presets.",
      action: {
        kind: "button",
        label: "New preset",
        variant: "tertiary",
        color: "brand",
        icon: <FigmaIcon name="plus" size={20} />,
      },
      rows: PRESET_ROWS,
    },
    {
      id: "printer-accessories",
      title: "Accessories",
      description: "Hardware attached to this printer.",
      rows: [
        {
          title: "Nozzle type",
          description: "Affects abrasive filament compatibility.",
          control: {
            kind: "select",
            id: "p1sNozzleType",
            initial: "Stainless steel",
            options: ["Stainless steel", "Hardened steel"],
          },
        },
        {
          title: "Auxiliary part cooling fan",
          control: { kind: "switch", id: "p1sAuxFan", initial: true },
        },
        {
          title: "Air filtration / exhaust fan",
          control: { kind: "switch", id: "p1sExhaustFan", initial: true },
        },
        {
          title: "Chamber temperature control",
          control: { kind: "switch", id: "p1sChamberTemp", initial: false },
        },
      ],
    },
    {
      id: "printer-gcode",
      title: "Machine G-code",
      description: "Custom G-code executed at key points of every print.",
      body: () => (
        <>
          <SettingsCard>
            <SettingRow
              title="Machine start G-code"
              description="214 lines · Runs before every print."
              control={<SettingLink>Expand</SettingLink>}
            />
            <CodeBlock lines={START_GCODE} />
          </SettingsCard>
          <SettingsCard>
            <SettingRow
              title="Machine end G-code"
              description="86 lines · Runs after every print."
              control={<SettingLink>Edit</SettingLink>}
            />
            <SettingRow
              title="Layer change G-code"
              description="12 lines · Runs at every layer change."
              control={<SettingLink>Edit</SettingLink>}
            />
            <SettingRow
              title="Time lapse G-code"
              description="9 lines · Positions the head for timelapse frames."
              control={<SettingLink>Edit</SettingLink>}
            />
            <SettingRow
              title="Change filament G-code"
              description="64 lines · Runs on AMS filament swaps."
              control={<SettingLink>Edit</SettingLink>}
            />
            <SettingRow
              title="Pause G-code"
              description="18 lines · Runs when a print is paused."
              control={<SettingLink>Edit</SettingLink>}
            />
          </SettingsCard>
        </>
      ),
    },
    {
      id: "printer-extruder",
      title: "Extruder",
      description: "Nozzle, layer height and retraction behavior.",
      rows: [
        {
          title: "Nozzle diameter",
          control: {
            kind: "select",
            id: "p1sNozzleDiameter",
            initial: "0.4 mm",
            options: ["0.2 mm", "0.4 mm", "0.6 mm", "0.8 mm"],
          },
        },
        {
          title: "Retraction length (mm)",
          control: { kind: "number", id: "p1sRetractionLength", initial: "0.8" },
        },
        {
          title: "Retraction speed (mm/s)",
          control: { kind: "number", id: "p1sRetractionSpeed", initial: "30" },
        },
        {
          title: "Deretraction speed (mm/s)",
          control: { kind: "number", id: "p1sDeretractionSpeed", initial: "30" },
        },
        {
          title: "Z-hop when retracting (mm)",
          control: { kind: "number", id: "p1sZHop", initial: "0.4" },
        },
        {
          title: "Z-hop type",
          control: {
            kind: "select",
            id: "p1sZHopType",
            initial: "Auto",
            options: ["Auto", "Normal", "Slope", "Spiral"],
          },
        },
        {
          title: "Retract on layer change",
          control: { kind: "switch", id: "p1sRetractOnLayerChange", initial: true },
        },
        {
          title: "Wipe while retracting",
          description: "Wipes the nozzle along the seam to reduce stringing.",
          control: { kind: "switch", id: "p1sWipe", initial: true },
        },
      ],
    },
    {
      id: "printer-multimaterial",
      title: "Multimaterial",
      description: "AMS and multi-color printing behavior.",
      rows: [
        {
          title: "Prime volume (mm³)",
          description: "Filament primed after each color change.",
          control: { kind: "number", id: "p1sPrimeVolume", initial: "45" },
        },
        {
          title: "Flushing volumes",
          description: "Auto-calculated from filament colors.",
          control: { kind: "link", text: "Edit matrix" },
        },
      ],
    },
    {
      id: "printer-manage",
      title: "Manage",
      description: "Profile management for this printer.",
      rows: [
        {
          title: "Printer profile",
          description: "Based on Bambu Lab P1S 0.4 nozzle.",
          control: { kind: "disclosure", text: "System" },
          onClick: () => {},
        },
        {
          title: "Reset to factory profile",
          description: "Discard local overrides on this printer.",
          control: { kind: "link", text: "Reset" },
        },
        {
          title: "Remove printer",
          description: "Permanently remove this printer from Bambu Studio.",
          control: {
            kind: "button",
            label: "Remove",
            variant: "secondary",
            color: "danger",
          },
        },
      ],
    },
  ],
};
