import { SpecTabPanel, type SectionSpec } from "./ProcessTabPanel";

/**
 * Process → Speed tab. Field inventory mirrors Bambu Studio's Speed page
 * (`Tab.cpp`), values are Studio's built-in defaults (`PrintConfig.cpp`).
 *
 * Studio renders the five overhang speeds as one "Overhang speed" line with
 * 10%–100% sub-inputs; here each gets its own row with a prefixed label.
 */

const heightSlowdownEnabled = (state: { checked: (id: string) => boolean }) =>
  state.checked("enable_height_slowdown");

const SECTIONS: readonly SectionSpec[] = [
  {
    title: "Initial layer speed",
    fields: [
      { kind: "text", id: "initial_layer_speed", label: "Initial layer", defaultValue: "30", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "initial_layer_infill_speed", label: "Initial layer infill", defaultValue: "60", unit: "mm/s", inputMode: "decimal" },
    ],
  },
  {
    title: "Other layers speed",
    fields: [
      { kind: "text", id: "outer_wall_speed", label: "Outer wall", defaultValue: "60", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "inner_wall_speed", label: "Inner wall", defaultValue: "60", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "small_perimeter_speed", label: "Small perimeters", defaultValue: "50", unit: "mm/s or %", inputMode: "decimal" },
      { kind: "text", id: "small_perimeter_threshold", label: "Small perimeter threshold", defaultValue: "0", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "sparse_infill_speed", label: "Sparse infill", defaultValue: "100", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "internal_solid_infill_speed", label: "Internal solid infill", defaultValue: "100", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "vertical_shell_speed", label: "Vertical shell speed", defaultValue: "80", unit: "mm/s or %", inputMode: "decimal" },
      { kind: "text", id: "top_surface_speed", label: "Top surface", defaultValue: "100", unit: "mm/s", inputMode: "decimal" },
      { kind: "checkbox", id: "enable_overhang_speed", label: "Slow down for overhang", defaultChecked: true },
      { kind: "text", id: "overhang_1_4_speed", label: "Overhang speed 10%", defaultValue: "0", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "overhang_2_4_speed", label: "Overhang speed 25%", defaultValue: "0", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "overhang_3_4_speed", label: "Overhang speed 50%", defaultValue: "0", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "overhang_4_4_speed", label: "Overhang speed 75%", defaultValue: "0", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "overhang_totally_speed", label: "Overhang speed 100%", defaultValue: "10", unit: "mm/s", inputMode: "decimal" },
      { kind: "checkbox", id: "enable_height_slowdown", label: "Slow down by height", defaultChecked: false },
      { kind: "text", id: "slowdown_start_height", label: "Starting height", defaultValue: "0", unit: "mm", inputMode: "decimal", visibleWhen: heightSlowdownEnabled },
      { kind: "text", id: "slowdown_start_speed", label: "Speed at starting height", defaultValue: "1000", unit: "mm/s", inputMode: "decimal", visibleWhen: heightSlowdownEnabled },
      { kind: "text", id: "slowdown_start_acc", label: "Acceleration at starting height", defaultValue: "100000", unit: "mm/s²", inputMode: "decimal", visibleWhen: heightSlowdownEnabled },
      { kind: "text", id: "slowdown_end_height", label: "Ending height", defaultValue: "400", unit: "mm", inputMode: "decimal", visibleWhen: heightSlowdownEnabled },
      { kind: "text", id: "slowdown_end_speed", label: "Speed at ending height", defaultValue: "1000", unit: "mm/s", inputMode: "decimal", visibleWhen: heightSlowdownEnabled },
      { kind: "text", id: "slowdown_end_acc", label: "Acceleration at ending height", defaultValue: "100000", unit: "mm/s²", inputMode: "decimal", visibleWhen: heightSlowdownEnabled },
      { kind: "text", id: "bridge_speed", label: "Bridge", defaultValue: "25", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "gap_infill_speed", label: "Gap infill", defaultValue: "30", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "support_speed", label: "Support", defaultValue: "80", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "support_interface_speed", label: "Support interface", defaultValue: "80", unit: "mm/s", inputMode: "decimal" },
    ],
  },
  {
    title: "Travel speed",
    fields: [
      { kind: "text", id: "travel_speed", label: "Travel", defaultValue: "120", unit: "mm/s", inputMode: "decimal" },
    ],
  },
  {
    title: "Acceleration",
    fields: [
      { kind: "text", id: "default_acceleration", label: "Normal printing", defaultValue: "500", unit: "mm/s²", inputMode: "decimal" },
      { kind: "text", id: "travel_acceleration", label: "Travel", defaultValue: "500", unit: "mm/s²", inputMode: "decimal" },
      { kind: "text", id: "travel_short_distance_acceleration", label: "Short travel", defaultValue: "250", unit: "mm/s²", inputMode: "decimal" },
      { kind: "text", id: "initial_layer_travel_acceleration", label: "Initial layer travel", defaultValue: "500", unit: "mm/s²", inputMode: "decimal" },
      { kind: "text", id: "initial_layer_acceleration", label: "Initial layer", defaultValue: "300", unit: "mm/s²", inputMode: "decimal" },
      { kind: "text", id: "outer_wall_acceleration", label: "Outer wall", defaultValue: "500", unit: "mm/s²", inputMode: "decimal" },
      { kind: "text", id: "inner_wall_acceleration", label: "Inner wall", defaultValue: "0", unit: "mm/s²", inputMode: "decimal" },
      { kind: "text", id: "top_surface_acceleration", label: "Top surface", defaultValue: "500", unit: "mm/s²", inputMode: "decimal" },
      { kind: "text", id: "sparse_infill_acceleration", label: "Sparse infill", defaultValue: "100", unit: "mm/s² or %", inputMode: "decimal" },
      { kind: "checkbox", id: "accel_to_decel_enable", label: "Enable accel_to_decel", defaultChecked: false },
      { kind: "text", id: "accel_to_decel_factor", label: "accel_to_decel", defaultValue: "50", unit: "%", inputMode: "decimal", visibleWhen: (s) => s.checked("accel_to_decel_enable") },
    ],
  },
  {
    title: "Jerk(XY)",
    fields: [
      { kind: "text", id: "default_jerk", label: "Default", defaultValue: "0", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "outer_wall_jerk", label: "Outer wall", defaultValue: "9", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "inner_wall_jerk", label: "Inner wall", defaultValue: "9", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "infill_jerk", label: "Infill", defaultValue: "9", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "top_surface_jerk", label: "Top surface", defaultValue: "9", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "initial_layer_jerk", label: "First layer", defaultValue: "9", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "travel_jerk", label: "Travel", defaultValue: "9", unit: "mm/s", inputMode: "decimal" },
    ],
  },
];

export function SpeedTabPanel() {
  return <SpecTabPanel sections={SECTIONS} />;
}
