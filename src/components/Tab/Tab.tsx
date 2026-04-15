import type { ButtonHTMLAttributes, ReactNode } from "react";

import "./Tab.css";

export type TabProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  /** Tab label */
  children: ReactNode;
  /** Selected tab — shows brand bottom border and emphasis colors */
  active?: boolean;
  /**
   * Use override (orange) content ramp instead of base greyscale.
   * Figma node 2750:8308 — "Override" column.
   */
  override?: boolean;
};

export function Tab({
  children,
  active = false,
  override = false,
  className = "",
  type = "button",
  disabled,
  ...rest
}: TabProps) {
  const rootClass = [
    "tab",
    active ? "tab--active" : "",
    override ? "tab--override" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={rootClass}
      disabled={disabled}
      {...rest}
    >
      <span className="tab__inner">
        <span className="tab__label">{children}</span>
      </span>
    </button>
  );
}
