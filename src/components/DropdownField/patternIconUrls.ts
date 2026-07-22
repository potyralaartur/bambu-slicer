const patternAsset = (filename: string) =>
  import.meta.env.BASE_URL +
  "assets/dropdown-field/patterns/" +
  filename +
  ".svg";

const rectilinearAsset =
  import.meta.env.BASE_URL + "assets/dropdown-field/pattern-latest.svg";

/**
 * Original Bambu Studio parameter-pattern artwork, exported from Figma
 * node 8802:2170. Reused artwork intentionally points at the same asset.
 */
const PATTERN_ICON_URLS: Readonly<Record<string, string>> = {
  "Monotonic line": patternAsset("monotonic-line"),
  Monotonic: patternAsset("monotonic"),
  Rectilinear: rectilinearAsset,
  "Aligned Rectilinear": rectilinearAsset,
  Line: patternAsset("line"),
  Concentric: patternAsset("concentric"),
  "Zig Zag": patternAsset("zig-zag"),
  "Cross Zag": patternAsset("cross-zag"),
  "Locked Zag": patternAsset("locked-zag"),
  Grid: patternAsset("grid"),
  "Cross Hatch": patternAsset("cross-hatch"),
  Triangles: patternAsset("triangles"),
  "Tri-hexagon": patternAsset("tri-hexagon"),
  "2D Lattice": patternAsset("two-d-lattice"),
  Honeycomb: patternAsset("honeycomb"),
  "3D Honeycomb": patternAsset("honeycomb"),
  Gyroid: patternAsset("gyroid"),
  Cubic: patternAsset("cubic"),
  "Support Cubic": patternAsset("cubic"),
  "Adaptive Cubic": patternAsset("adaptive-cubic"),
  Lightning: patternAsset("lightning"),
  "Hilbert Curve": patternAsset("hilbert-curve"),
  "Archimedean Chords": patternAsset("archimedean-chords"),
  "Octagram Spiral": patternAsset("octagram-spiral"),
};

export function getPatternIconUrl(value: string): string | undefined {
  return PATTERN_ICON_URLS[value];
}
