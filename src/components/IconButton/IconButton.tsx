import type { ButtonHTMLAttributes, ReactNode } from "react";

import "./IconButton.css";

/**
 * Figma 2532:3085 — Icon Button sizes.
 * Small: 24×24, glyph 16px; Medium: 32×32, glyph 20px; Large: 40×40, glyph 28px.
 */
export type IconButtonSize = "small" | "medium" | "large";

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  children: ReactNode;
  /** Icon-only control — required for screen readers. */
  "aria-label": string;
  /** Default `medium` matches the design system default instance. */
  size?: IconButtonSize;
};

export function IconButton({
  children,
  className = "",
  type = "button",
  size = "medium",
  ...rest
}: IconButtonProps) {
  const rootClass = [
    "icon-button",
    `icon-button--${size}`,
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
