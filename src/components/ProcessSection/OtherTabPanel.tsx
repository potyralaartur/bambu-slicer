import { SpecTabPanel, type SectionSpec } from "./ProcessTabPanel";

/**
 * Process → Other tab. Field inventory mirrors Bambu Studio's "Others" page
 * (`Tab.cpp`), values are Studio's built-in defaults (`PrintConfig.cpp`).
 * "Bed adhension" is Studio's literal group title (typo included).
 */

const fuzzySkinEnabled = (state: { value: (id: string) => string }) =>
  !["None(allow paint)", "Disabled"].includes(state.value("fuzzy_skin"));

const SECTIONS: readonly SectionSpec[] = [
  {
    title: "Bed adhension",
    fields: [
      { kind: "text", id: "skirt_loops", label: "Skirt loops", defaultValue: "1", inputMode: "numeric" },
      { kind: "text", id: "skirt_height", label: "Skirt height", defaultValue: "1", unit: "layers", inputMode: "numeric" },
      { kind: "text", id: "skirt_distance", label: "Skirt distance", defaultValue: "2", unit: "mm", inputMode: "decimal" },
      { kind: "dropdown", id: "brim_type", label: "Brim type", options: ["Auto", "Painted", "Outer brim only", "Inner brim only", "Outer and inner brim", "No-brim"], defaultValue: "Auto" },
      { kind: "text", id: "brim_width", label: "Brim width", defaultValue: "0", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "brim_object_gap", label: "Brim-object gap", defaultValue: "0", unit: "mm", inputMode: "decimal" },
    ],
  },
  {
    title: "Prime tower",
    fields: [
      { kind: "checkbox", id: "enable_prime_tower", label: "Enable", defaultChecked: false },
      { kind: "checkbox", id: "prime_tower_skip_points", label: "Skip points", defaultChecked: true },
      { kind: "checkbox", id: "prime_tower_enable_framework", label: "Internal ribs", defaultChecked: false },
      { kind: "text", id: "prime_tower_width", label: "Width", defaultValue: "35", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "prime_tower_max_speed", label: "Max speed", defaultValue: "90", unit: "mm/s", inputMode: "decimal" },
      { kind: "text", id: "prime_tower_brim_width", label: "Brim width", defaultValue: "3", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "prime_tower_infill_gap", label: "Infill gap", defaultValue: "150", unit: "%", inputMode: "decimal" },
      { kind: "checkbox", id: "prime_tower_rib_wall", label: "Rib wall", defaultChecked: true },
      { kind: "text", id: "prime_tower_extra_rib_length", label: "Extra rib length", defaultValue: "0", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "prime_tower_rib_width", label: "Rib width", defaultValue: "8", unit: "mm", inputMode: "decimal" },
      { kind: "checkbox", id: "prime_tower_fillet_wall", label: "Fillet wall", defaultChecked: true },
      { kind: "checkbox", id: "enable_tower_interface_features", label: "Enable tower interface features", defaultChecked: false },
    ],
  },
  {
    title: "Flush options",
    fields: [
      { kind: "checkbox", id: "flush_into_infill", label: "Flush into objects' infill", defaultChecked: false },
      { kind: "checkbox", id: "flush_into_objects", label: "Flush into this object", defaultChecked: false },
      { kind: "checkbox", id: "flush_into_support", label: "Flush into objects' support", defaultChecked: true },
    ],
  },
  {
    title: "Special mode",
    fields: [
      { kind: "dropdown", id: "slicing_mode", label: "Slicing Mode", options: ["Regular", "Even-odd", "Close holes"], defaultValue: "Regular" },
      { kind: "dropdown", id: "print_sequence", label: "Print sequence", options: ["By layer", "By object"], defaultValue: "By layer" },
      { kind: "checkbox", id: "spiral_mode", label: "Spiral vase", defaultChecked: false },
      { kind: "checkbox", id: "spiral_mode_smooth", label: "Smooth Spiral", defaultChecked: false, visibleWhen: (s) => s.checked("spiral_mode") },
      { kind: "text", id: "spiral_mode_max_xy_smoothing", label: "Max XY Smoothing", defaultValue: "200", unit: "mm or %", inputMode: "decimal", visibleWhen: (s) => s.checked("spiral_mode") && s.checked("spiral_mode_smooth") },
      { kind: "dropdown", id: "timelapse_type", label: "Timelapse", options: ["Traditional", "Smooth"], defaultValue: "Traditional" },
      { kind: "dropdown", id: "fuzzy_skin", label: "Fuzzy Skin", options: ["None(allow paint)", "Contour", "Contour and hole", "All walls", "Disabled"], defaultValue: "None(allow paint)" },
      { kind: "dropdown", id: "fuzzy_skin_mode", label: "Fuzzy skin generator mode", options: ["Displacement", "Extrusion", "Combined"], defaultValue: "Displacement", visibleWhen: fuzzySkinEnabled },
      { kind: "dropdown", id: "fuzzy_skin_noise_type", label: "Fuzzy skin noise type", options: ["Classic", "Perlin", "Billow", "Ridged Multifractal", "Voronoi"], defaultValue: "Classic", visibleWhen: fuzzySkinEnabled },
      { kind: "text", id: "fuzzy_skin_point_distance", label: "Fuzzy skin point distance", defaultValue: "0.8", unit: "mm", inputMode: "decimal", visibleWhen: fuzzySkinEnabled },
      { kind: "text", id: "fuzzy_skin_thickness", label: "Fuzzy skin thickness", defaultValue: "0.3", unit: "mm", inputMode: "decimal", visibleWhen: fuzzySkinEnabled },
      { kind: "text", id: "fuzzy_skin_scale", label: "Fuzzy skin feature size", defaultValue: "1", unit: "mm", inputMode: "decimal", visibleWhen: fuzzySkinEnabled },
      { kind: "text", id: "fuzzy_skin_octaves", label: "Fuzzy skin noise octaves", defaultValue: "4", inputMode: "numeric", visibleWhen: fuzzySkinEnabled },
      { kind: "text", id: "fuzzy_skin_persistence", label: "Fuzzy skin noise persistence", defaultValue: "0.5", inputMode: "decimal", visibleWhen: fuzzySkinEnabled },
      { kind: "checkbox", id: "fuzzy_skin_first_layer", label: "Apply fuzzy skin to first layer", defaultChecked: false, visibleWhen: fuzzySkinEnabled },
    ],
  },
  {
    title: "Advanced",
    fields: [
      { kind: "checkbox", id: "enable_wrapping_detection", label: "Enable clumping detection", defaultChecked: false },
      { kind: "checkbox", id: "enable_order_independent_overlap_carving", label: "Order-independent overlap carving", defaultChecked: false },
      { kind: "checkbox", id: "interlocking_beam", label: "Use beam interlocking", defaultChecked: false },
      { kind: "text", id: "mmu_segmented_region_interlocking_depth", label: "Interlocking depth of a segmented region", defaultValue: "0", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "interlocking_beam_width", label: "Interlocking beam width", defaultValue: "0.8", unit: "mm", inputMode: "decimal", visibleWhen: (s) => s.checked("interlocking_beam") },
      { kind: "text", id: "interlocking_orientation", label: "Interlocking direction", defaultValue: "22.5", unit: "°", inputMode: "decimal", visibleWhen: (s) => s.checked("interlocking_beam") },
      { kind: "text", id: "interlocking_beam_layer_count", label: "Interlocking beam layers", defaultValue: "2", inputMode: "numeric", visibleWhen: (s) => s.checked("interlocking_beam") },
      { kind: "text", id: "interlocking_depth", label: "Interlocking depth", defaultValue: "2", inputMode: "numeric", visibleWhen: (s) => s.checked("interlocking_beam") },
      { kind: "text", id: "interlocking_boundary_avoidance", label: "Interlocking boundary avoidance", defaultValue: "2", inputMode: "numeric", visibleWhen: (s) => s.checked("interlocking_beam") },
      { kind: "dropdown", id: "sparse_infill_filament", label: "Sparse infill filament", options: ["Default"], defaultValue: "Default" },
      { kind: "dropdown", id: "solid_infill_filament", label: "Solid infill", options: ["Default"], defaultValue: "Default" },
      { kind: "dropdown", id: "wall_filament", label: "Walls", options: ["Default"], defaultValue: "Default" },
    ],
  },
  {
    title: "G-code output",
    fields: [
      { kind: "dropdown", id: "reduce_infill_retraction_mode", label: "Reduce infill retraction", options: ["Disabled", "Auto", "Enabled"], defaultValue: "Auto" },
      { kind: "checkbox", id: "gcode_add_line_number", label: "Add line number", defaultChecked: false },
      { kind: "checkbox", id: "exclude_object", label: "Exclude objects", defaultChecked: true },
      { kind: "text", id: "filename_format", label: "Filename format", defaultValue: "[input_filename_base].gcode" },
    ],
  },
  {
    title: "Post-processing scripts",
    fields: [
      { kind: "text", id: "post_process", label: "Post-processing Scripts", defaultValue: "" },
    ],
  },
  {
    title: "Notes",
    fields: [
      { kind: "text", id: "process_notes", label: "Process notes", defaultValue: "" },
    ],
  },
];

export function OtherTabPanel() {
  return <SpecTabPanel sections={SECTIONS} />;
}
