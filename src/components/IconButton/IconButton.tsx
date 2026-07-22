import type { ButtonHTMLAttributes, ReactNode } from "react";

import "./IconButton.css";

/**
 * Figma 2532:3085 — Icon Button sizes.
 * Small: 24×24, glyph 16px; Medium: 28×28, glyph 20px; Large: 32×32, glyph 24px.
 */
export type IconButtonSize = "small" | "medium" | "large";

/**
 * Surface treatment — Figma `Type` axis.
 * - `base`: neutral grey glyph on app panels (default)
 * - `overlay`: near-white glyph for floating controls on the canvas / media
 *   surface (e.g. the Camera Control Bar), where a bright icon reads against a
 *   dark translucent background.
 */
export type IconButtonVariant = "base" | "overlay";

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  children: ReactNode;
  /** Icon-only control — required for screen readers. */
  "aria-label": string;
  /** Default `medium` matches the design system default instance. */
  size?: IconButtonSize;
  /** Surface treatment; `base` (default) or `overlay` for canvas controls. */
  variant?: IconButtonVariant;
};

export function IconButton({
  children,
  className = "",
  type = "button",
  size = "medium",
  variant = "base",
  ...rest
}: IconButtonProps) {
  const rootClass = [
    "icon-button",
    `icon-button--${size}`,
    `icon-button--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={rootClass} {...rest}>
      <span className="icon-button__glyph">{children}</span>
    </button>
  );
}
