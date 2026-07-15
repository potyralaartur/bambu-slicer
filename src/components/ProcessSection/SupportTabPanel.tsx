import { SpecTabPanel, type SectionSpec } from "./ProcessTabPanel";

/**
 * Process → Support tab. Field inventory mirrors Bambu Studio's Support page
 * (`Tab.cpp`), values are Studio's built-in defaults (`PrintConfig.cpp`).
 */

const SECTIONS: readonly SectionSpec[] = [
  {
    title: "Support",
    fields: [
      { kind: "checkbox", id: "enable_support", label: "Enable support", defaultChecked: false },
      { kind: "dropdown", id: "support_type", label: "Type", options: ["normal(auto)", "tree(auto)", "normal(manual)", "tree(manual)"], defaultValue: "normal(auto)" },
      { kind: "dropdown", id: "support_style", label: "Style", options: ["Default", "Grid", "Snug", "Tree Slim", "Tree Strong", "Tree Hybrid", "Tree Organic"], defaultValue: "Default" },
      { kind: "text", id: "support_threshold_angle", label: "Threshold angle", defaultValue: "30", unit: "°", inputMode: "numeric" },
      { kind: "checkbox", id: "support_on_build_plate_only", label: "On build plate only", defaultChecked: false },
      { kind: "checkbox", id: "support_critical_regions_only", label: "Support critical regions only", defaultChecked: false },
      { kind: "checkbox", id: "support_remove_small_overhang", label: "Remove small overhangs", defaultChecked: true },
    ],
  },
  {
    title: "Raft",
    fields: [
      { kind: "text", id: "raft_layers", label: "Raft layers", defaultValue: "0", unit: "layers", inputMode: "numeric" },
      { kind: "text", id: "raft_contact_distance", label: "Raft contact Z distance", defaultValue: "0.1", unit: "mm", inputMode: "decimal" },
    ],
  },
  {
    title: "Support filament",
    fields: [
      { kind: "dropdown", id: "support_filament", label: "Support/raft base", options: ["Default"], defaultValue: "Default" },
      { kind: "dropdown", id: "support_interface_filament", label: "Support/raft interface", options: ["Default"], defaultValue: "Default" },
      { kind: "checkbox", id: "support_interface_not_for_body", label: "Avoid interface filament for base", defaultChecked: true },
    ],
  },
  {
    title: "Support ironing",
    fields: [
      { kind: "checkbox", id: "enable_support_ironing", label: "Enable ironing support interface", defaultChecked: false },
      { kind: "dropdown", id: "support_ironing_pattern", label: "Support ironing pattern", options: ["Concentric", "Rectilinear"], defaultValue: "Rectilinear", showPattern: true },
      { kind: "text", id: "support_ironing_speed", label: "Support ironing speed", defaultValue: "20", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "support_ironing_flow", label: "Support ironing flow", defaultValue: "10", unit: "%", inputMode: "decimal" },
      { kind: "text", id: "support_ironing_spacing", label: "Support ironing line spacing", defaultValue: "0.1", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "support_ironing_inset", label: "Support ironing inset", defaultValue: "0", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "support_ironing_direction", label: "Support ironing direction", defaultValue: "0", unit: "°", inputMode: "decimal" },
    ],
  },
  {
    title: "Advanced",
    fields: [
      { kind: "text", id: "raft_first_layer_density", label: "Initial layer density", defaultValue: "90", unit: "%", inputMode: "decimal" },
      { kind: "text", id: "raft_first_layer_expansion", label: "Initial layer expansion", defaultValue: "-1", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "tree_support_wall_count", label: "Support wall loops", defaultValue: "-1", inputMode: "numeric" },
      { kind: "text", id: "support_top_z_distance", label: "Top Z distance", defaultValue: "0.2", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "support_bottom_z_distance", label: "Bottom Z distance", defaultValue: "0.2", unit: "mm", inputMode: "decimal" },
      { kind: "dropdown", id: "support_base_pattern", label: "Base pattern", options: ["Default", "Rectilinear", "Rectilinear grid", "Honeycomb", "Lightning", "Hollow"], defaultValue: "Default" },
      { kind: "text", id: "support_base_pattern_spacing", label: "Base pattern spacing", defaultValue: "2.5", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "support_angle", label: "Pattern angle", defaultValue: "0", unit: "°", inputMode: "decimal" },
      { kind: "text", id: "support_interface_top_layers", label: "Top interface layers", defaultValue: "3", unit: "layers", inputMode: "numeric" },
      { kind: "text", id: "support_interface_bottom_layers", label: "Bottom interface layers", defaultValue: "0", unit: "layers", inputMode: "numeric" },
      { kind: "dropdown", id: "support_interface_pattern", label: "Interface pattern", options: ["Default", "Rectilinear", "Concentric", "Rectilinear Interlaced", "Grid"], defaultValue: "Default" },
      { kind: "text", id: "support_interface_spacing", label: "Top interface spacing", defaultValue: "0.5", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "support_bottom_interface_spacing", label: "Bottom interface spacing", defaultValue: "0.5", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "support_expansion", label: "Normal Support expansion", defaultValue: "0", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "support_object_xy_distance", label: "Support/object xy distance", defaultValue: "0.35", unit: "mm", inputMode: "decimal" },
      { kind: "checkbox", id: "top_z_overrides_xy_distance", label: "Z overrides X/Y", defaultChecked: false },
      { kind: "text", id: "support_object_first_layer_gap", label: "Support/object first layer gap", defaultValue: "0.2", unit: "mm", inputMode: "decimal" },
      { kind: "checkbox", id: "bridge_no_support", label: "Don't support bridges", defaultChecked: false },
      { kind: "text", id: "max_bridge_length", label: "Max bridge length", defaultValue: "10", unit: "mm", inputMode: "decimal" },
      { kind: "checkbox", id: "independent_support_layer_height", label: "Independent support layer height", defaultChecked: true },
    ],
  },
  {
    title: "Tree Support",
    fields: [
      { kind: "text", id: "tree_support_branch_distance", label: "Branch distance", defaultValue: "5", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "tree_support_branch_diameter", label: "Branch diameter", defaultValue: "5", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "tree_support_branch_angle", label: "Branch angle", defaultValue: "40", unit: "°", inputMode: "decimal" },
      { kind: "text", id: "tree_support_branch_diameter_angle", label: "Branch diameter angle", defaultValue: "5", unit: "°", inputMode: "decimal" },
    ],
  },
];

export function SupportTabPanel() {
  return <SpecTabPanel sections={SECTIONS} />;
}
