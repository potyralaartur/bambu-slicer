import type { CSSProperties } from "react";

import type { FigmaIconName } from "./figmaIconUrls";
import { FIGMA_ICON_URLS } from "./figmaIconUrls";

import "./FigmaIcon.css";

export type FigmaIconProps = {
  name: FigmaIconName;
  className?: string;
  size?: number;
  title?: string;
};

/**
 * Renders the Figma-exported SVG as a `currentColor` mask so the glyph inherits
 * its container's color and changes with state (hover/active/disabled). The
 * asset files bake in `fill="white"`, so an `<img>` could never be tinted.
 *
 * Two elements on purpose: the outer `.figma-icon` is a plain box that carries
 * any `filter` (the Figma "Contrast shadow"), while the inner `.figma-icon__mask`
 * holds the mask. CSS applies `filter` before `mask`, so a drop-shadow set on the
 * masked element would be clipped away by its own mask — it must sit on a wrapper.
 */
export function FigmaIcon({ name, className, size = 20, title }: FigmaIconProps) {
  const src = FIGMA_ICON_URLS[name];
  const rootClass = ["figma-icon", className].filter(Boolean).join(" ");
  const maskStyle: CSSProperties = {
    WebkitMaskImage: `url("${src}")`,
    maskImage: `url("${src}")`,
  };

  return (
    <span
      className={rootClass}
      style={{ width: size, height: size }}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
    >
      <span className="figma-icon__mask" style={maskStyle} />
    </span>
  );
}
