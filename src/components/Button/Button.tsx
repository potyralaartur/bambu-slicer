import type { ButtonHTMLAttributes, ReactNode } from "react";

import "./Button.css";

/** Figma 2599:3671 — globe stroke icon in a 20×20px slot (matches design). */
function GlobeIcon20() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="translate(2 2)">
        <path
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
          stroke="currentColor"
          strokeWidth={1.25}
        />
        <path
          d="M3.5 10h13M10 2.5c2.5 2.2 2.5 12.8 0 15M10 2.5c-2.5 2.2-2.5 12.8 0 15"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export type ButtonColor = "brand" | "base";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /** Label; defaults to “Button” to match the Figma component. */
  children?: ReactNode;
  /** Brand (accent) or base (neutral) palette — Figma `color`. */
  color?: ButtonColor;
  leftIcon?: boolean;
  rightIcon?: boolean;
};

export function Button({
  children = "Button",
  color = "brand",
  leftIcon = true,
  rightIcon = true,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const rootClass = ["button", `button--${color}`, className].filter(Boolean).join(" ");

  return (
    <button type={type} className={rootClass} {...rest}>
      {leftIcon ? (
        <span className="button__icon" aria-hidden>
          <GlobeIcon20 />
        </span>
      ) : null}
      <span className="button__label">{children}</span>
      {rightIcon ? (
        <span className="button__icon" aria-hidden>
          <GlobeIcon20 />
        </span>
      ) : null}
    </button>
  );
}
