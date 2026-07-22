import { FigmaIcon } from "../../../icons";
import { SettingDisclosure, SettingRow } from "../../SettingRow/SettingRow";
import { SettingsCard } from "../../SettingsCard/SettingsCard";
import type { PageConfig } from "../types";

type Preset = {
  /** Preset name, e.g. "Bambu PLA Basic". */
  name: string;
  /** Spec line, e.g. "PLA · P1S, X1C, A1". */
  spec: string;
  /** Origin shown on the trailing disclosure. */
  source: "System" | "User";
};

const FILAMENT_PRESETS: Preset[] = [
  { name: "Bambu PLA Basic", spec: "PLA · P1S, X1C, A1", source: "System" },
  { name: "Bambu PLA Matte", spec: "PLA · P1S, X1C, A1", source: "System" },
  { name: "Bambu PETG HF", spec: "PETG · P1S, X1C", source: "System" },
  { name: "Generic PLA", spec: "PLA · All printers", source: "System" },
  { name: "PolyTerra PLA Sage", spec: "PLA · P1S, X1C", source: "User" },
];

const PROCESS_PRESETS: Preset[] = [
  { name: "0.08mm Extra Fine", spec: "0.4 mm nozzle · P1S, X1C", source: "System" },
  { name: "0.12mm Fine", spec: "0.4 mm nozzle · P1S, X1C", source: "System" },
  { name: "0.20mm Standard", spec: "0.4 mm nozzle · P1S, X1C, A1", source: "System" },
  { name: "0.28mm Draft", spec: "0.4 mm nozzle · P1S, X1C", source: "System" },
  { name: "0.16mm Detail", spec: "0.4 mm nozzle · X1C", source: "User" },
];

/**
 * Card of preset rows. Each is a two-line drill-in (name + spec) with a
 * System/User disclosure — Figma Setting Row 9384:6907. No preset detail page
 * exists yet, so the row click is a placeholder.
 */
function PresetList({ presets }: { presets: Preset[] }) {
  return (
    <SettingsCard>
      {presets.map((preset) => (
        <SettingRow
          key={preset.name}
          title={preset.name}
          description={preset.spec}
          control={<SettingDisclosure>{preset.source}</SettingDisclosure>}
          onClick={() => {}}
        />
      ))}
    </SettingsCard>
  );
}

const newPresetAction = {
  kind: "button" as const,
  label: "New preset",
  variant: "tertiary" as const,
  color: "brand" as const,
  icon: <FigmaIcon name="plus" size={20} />,
};

/** Presets page — Figma Settings Content variant 9331:9603. */
export const PRESETS_PAGE: PageConfig = {
  id: "presets",
  label: "Presets",
  icon: "layers-three",
  title: "Presets",
  subtitle: "Manage your filament and process profiles.",
  sections: [
    {
      id: "filament-presets",
      title: "Filament",
      description: "Select a preset to edit it. Duplicates are saved as user presets.",
      action: newPresetAction,
      body: () => <PresetList presets={FILAMENT_PRESETS} />,
    },
    {
      id: "process-presets",
      title: "Process",
      description: "Select a preset to edit it. Duplicates are saved as user presets.",
      action: newPresetAction,
      body: () => <PresetList presets={PROCESS_PRESETS} />,
    },
    {
      id: "preset-behavior",
      title: "Behavior",
      description: "How presets update and switch.",
      rows: [
        {
          title: "Auto-transfer modified values",
          description: "Keep your edits when switching process or filament presets.",
          control: { kind: "switch", id: "autoTransfer", initial: true },
        },
        {
          title: "Check for preset updates",
          description: "Update system printer, filament, and process presets.",
          control: { kind: "switch", id: "checkPresetUpdates", initial: true },
        },
      ],
    },
  ],
};
