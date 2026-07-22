import { SpecTabPanel, type SectionSpec } from "./ProcessTabPanel";

/**
 * Process → Strength tab. Field inventory mirrors Bambu Studio's Strength page
 * (`Tab.cpp`), values are Studio's built-in defaults (`PrintConfig.cpp`).
 */

const SURFACE_PATTERN_OPTIONS = [
  "Concentric",
  "Rectilinear",
  "Monotonic",
  "Monotonic line",
  "Aligned Rectilinear",
  "Hilbert Curve",
  "Archimedean Chords",
  "Octagram Spiral",
] as const;

const SPARSE_INFILL_PATTERN_OPTIONS = [
  "Concentric",
  "Rectilinear",
  "Grid",
  "Line",
  "Cubic",
  "Triangles",
  "Tri-hexagon",
  "Gyroid",
  "Honeycomb",
  "Adaptive Cubic",
  "Aligned Rectilinear",
  "3D Honeycomb",
  "Hilbert Curve",
  "Archimedean Chords",
  "Octagram Spiral",
  "Support Cubic",
  "Lightning",
  "Cross Hatch",
  "Zig Zag",
  "Cross Zag",
  "Locked Zag",
  "2D Lattice",
] as const;

const LOCKED_INFILL_PATTERN_OPTIONS = [
  "Concentric",
  "Rectilinear",
  "Grid",
  "Line",
  "Cubic",
  "Triangles",
  "Tri-hexagon",
  "Gyroid",
  "Honeycomb",
  "Aligned Rectilinear",
  "3D Honeycomb",
  "Hilbert Curve",
  "Archimedean Chords",
  "Octagram Spiral",
  "Cross Hatch",
  "Zig Zag",
  "Cross Zag",
] as const;

const isLockedZag = (state: { value: (id: string) => string }) =>
  state.value("sparse_infill_pattern") === "Locked Zag";
const isZigZagFamily = (state: { value: (id: string) => string }) =>
  ["Zig Zag", "Cross Zag", "Locked Zag"].includes(
    state.value("sparse_infill_pattern"),
  );

const SECTIONS: readonly SectionSpec[] = [
  {
    title: "Walls",
    fields: [
      { kind: "text", id: "wall_loops", label: "Wall loops", defaultValue: "2", inputMode: "numeric" },
      { kind: "checkbox", id: "alternate_extra_wall", label: "Alternate extra wall", defaultChecked: false },
      { kind: "checkbox", id: "embedding_wall_into_infill", label: "Embedding the wall into the infill", defaultChecked: false },
      { kind: "checkbox", id: "detect_thin_wall", label: "Detect thin wall", defaultChecked: false },
    ],
  },
  {
    title: "Top/bottom shells",
    fields: [
      { kind: "checkbox", id: "interface_shells", label: "Interface shells", defaultChecked: false },
      { kind: "dropdown", id: "top_surface_pattern", label: "Top surface pattern", options: SURFACE_PATTERN_OPTIONS, defaultValue: "Rectilinear", showPattern: true },
      { kind: "text", id: "top_surface_density", label: "Top surface density", defaultValue: "100", unit: "%", inputMode: "decimal" },
      { kind: "text", id: "top_shell_layers", label: "Top shell layers", defaultValue: "4", inputMode: "numeric" },
      { kind: "text", id: "top_shell_thickness", label: "Top shell thickness", defaultValue: "0.6", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "top_color_penetration_layers", label: "Top paint penetration layers", defaultValue: "4", inputMode: "numeric" },
      { kind: "dropdown", id: "bottom_surface_pattern", label: "Bottom surface pattern", options: SURFACE_PATTERN_OPTIONS, defaultValue: "Rectilinear", showPattern: true },
      { kind: "text", id: "bottom_surface_density", label: "Bottom surface density", defaultValue: "100", unit: "%", inputMode: "decimal" },
      { kind: "text", id: "bottom_shell_layers", label: "Bottom shell layers", defaultValue: "3", inputMode: "numeric" },
      { kind: "text", id: "bottom_shell_thickness", label: "Bottom shell thickness", defaultValue: "0", unit: "mm", inputMode: "decimal" },
      { kind: "text", id: "bottom_color_penetration_layers", label: "Bottom paint penetration layers", defaultValue: "3", inputMode: "numeric" },
      { kind: "checkbox", id: "infill_instead_top_bottom_surfaces", label: "Use infill instead of top and bottom surfaces", defaultChecked: false },
      { kind: "dropdown", id: "internal_solid_infill_pattern", label: "Internal solid infill pattern", options: SURFACE_PATTERN_OPTIONS, defaultValue: "Rectilinear", showPattern: true },
    ],
  },
  {
    title: "Sparse infill",
    fields: [
      { kind: "text", id: "sparse_infill_density", label: "Sparse infill density", defaultValue: "20", unit: "%", inputMode: "decimal" },
      { kind: "text", id: "fill_multiline", label: "Fill multiline", defaultValue: "1", inputMode: "numeric" },
      { kind: "dropdown", id: "sparse_infill_pattern", label: "Sparse infill pattern", options: SPARSE_INFILL_PATTERN_OPTIONS, defaultValue: "Cubic", showPattern: true },
      { kind: "dropdown", id: "locked_skin_infill_pattern", label: "Skin infill pattern", options: LOCKED_INFILL_PATTERN_OPTIONS, defaultValue: "Cross Zag", showPattern: true, visibleWhen: isLockedZag },
      { kind: "text", id: "skin_infill_density", label: "Skin infill density", defaultValue: "15", unit: "%", inputMode: "decimal", visibleWhen: isLockedZag },
      { kind: "dropdown", id: "locked_skeleton_infill_pattern", label: "Skeleton infill pattern", options: LOCKED_INFILL_PATTERN_OPTIONS, defaultValue: "Zig Zag", showPattern: true, visibleWhen: isLockedZag },
      { kind: "text", id: "skeleton_infill_density", label: "Skeleton infill density", defaultValue: "15", unit: "%", inputMode: "decimal", visibleWhen: isLockedZag },
      { kind: "text", id: "infill_lock_depth", label: "Infill lock depth", defaultValue: "1", unit: "mm", inputMode: "decimal", visibleWhen: isLockedZag },
      { kind: "text", id: "skin_infill_depth", label: "Skin infill depth", defaultValue: "2", unit: "mm", inputMode: "decimal", visibleWhen: isLockedZag },
      { kind: "text", id: "skin_infill_line_width", label: "Skin line width", defaultValue: "0.4", unit: "mm", inputMode: "decimal", visibleWhen: isLockedZag },
      { kind: "text", id: "skeleton_infill_line_width", label: "Skeleton line width", defaultValue: "0.4", unit: "mm", inputMode: "decimal", visibleWhen: isLockedZag },
      { kind: "checkbox", id: "symmetric_infill_y_axis", label: "Symmetric infill y axis", defaultChecked: false, visibleWhen: isZigZagFamily },
      { kind: "text", id: "infill_shift_step", label: "Infill shift step", defaultValue: "0.4", unit: "mm", inputMode: "decimal", visibleWhen: isZigZagFamily },
      { kind: "text", id: "sparse_infill_lattice_angle_1", label: "Lattice angle 1", defaultValue: "-45", unit: "°", inputMode: "decimal", visibleWhen: (s) => s.value("sparse_infill_pattern") === "2D Lattice" },
      { kind: "text", id: "sparse_infill_lattice_angle_2", label: "Lattice angle 2", defaultValue: "45", unit: "°", inputMode: "decimal", visibleWhen: (s) => s.value("sparse_infill_pattern") === "2D Lattice" },
      { kind: "text", id: "infill_rotate_step", label: "Infill rotate step", defaultValue: "0", unit: "°", inputMode: "decimal", visibleWhen: (s) => s.value("sparse_infill_pattern") === "Cross Zag" },
      { kind: "text", id: "sparse_infill_anchor", label: "Length of sparse infill anchor", defaultValue: "400", unit: "mm or %", inputMode: "decimal" },
      { kind: "text", id: "sparse_infill_anchor_max", label: "Maximum length of sparse infill anchor", defaultValue: "20", unit: "mm or %", inputMode: "decimal" },
      { kind: "text", id: "filter_out_gap_fill", label: "Filter out tiny gaps", defaultValue: "0", unit: "mm", inputMode: "decimal" },
    ],
  },
  {
    title: "Advanced",
    fields: [
      { kind: "text", id: "infill_wall_overlap", label: "Infill/Wall overlap", defaultValue: "15", unit: "%", inputMode: "decimal" },
      { kind: "text", id: "monotonic_travel_into_wall", label: "Monotonic line travel extend", defaultValue: "0", unit: "%", inputMode: "decimal" },
      { kind: "text", id: "infill_direction", label: "Infill direction", defaultValue: "45", unit: "°", inputMode: "decimal" },
      { kind: "text", id: "bridge_angle", label: "Bridge direction", defaultValue: "0", unit: "°", inputMode: "decimal" },
      { kind: "text", id: "minimum_sparse_infill_area", label: "Minimum sparse infill threshold", defaultValue: "15", unit: "mm²", inputMode: "decimal" },
      { kind: "checkbox", id: "infill_combination", label: "Infill combination", defaultChecked: false },
      { kind: "checkbox", id: "detect_narrow_internal_solid_infill", label: "Detect narrow internal solid infill", defaultChecked: true },
      { kind: "dropdown", id: "ensure_vertical_shell_thickness", label: "Ensure vertical shell thickness", options: ["Disabled", "Partial", "Enabled"], defaultValue: "Enabled" },
      { kind: "checkbox", id: "detect_floating_vertical_shell", label: "Detect floating vertical shells", defaultChecked: true },
    ],
  },
];

export function StrengthTabPanel() {
  return <SpecTabPanel sections={SECTIONS} />;
}
