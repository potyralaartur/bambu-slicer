import type { CSSProperties } from "react";

import "./NewTabIcon.css";

const RAW_BASE = import.meta.env.BASE_URL;
const BASE = RAW_BASE.endsWith("/") ? RAW_BASE.slice(0, -1) : RAW_BASE;

const ICONS = {
  "file-new": {
    src: BASE + "/assets/new-tab/icons/file-new.svg",
    inset: "8.33% 16.67% 8.33% 8.33%",
  },
  "maker-world": {
    src: BASE + "/assets/new-tab/icons/maker-world.svg",
    inset: "12.5%",
  },
  search: {
    src: BASE + "/assets/new-tab/icons/search.svg",
    inset: "12.5%",
  },
  heart: {
    src: BASE + "/assets/new-tab/icons/heart.svg",
    inset: "12.5% 8.3% 10.42% 8.3%",
  },
} as const;

export type NewTabIconName = keyof typeof ICONS;

export type NewTabIconProps = {
  name: NewTabIconName;
  size?: number;
  className?: string;
};

/** Uses the exact vector export and inset from the Figma icon instance. */
export function NewTabIcon({ name, size = 20, className = "" }: NewTabIconProps) {
  const icon = ICONS[name];
  const maskImage = 'url("' + icon.src + '")';
  const maskStyle: CSSProperties = {
    inset: icon.inset,
    WebkitMaskImage: maskImage,
    maskImage,
  };

  return (
    <span
      className={["new-tab-icon", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span className="new-tab-icon__mask" style={maskStyle} />
    </span>
  );
}
