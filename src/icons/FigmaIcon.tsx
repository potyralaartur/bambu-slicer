import type { FigmaIconName } from "./figmaIconUrls";
import { FIGMA_ICON_URLS } from "./figmaIconUrls";

export type FigmaIconProps = {
  name: FigmaIconName;
  className?: string;
  size?: number;
  title?: string;
};

export function FigmaIcon({ name, className, size = 20, title }: FigmaIconProps) {
  const src = FIGMA_ICON_URLS[name];

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={title ?? ""}
      className={className}
      decoding="async"
      {...(title ? { role: "img" } : { "aria-hidden": true })}
    />
  );
}
