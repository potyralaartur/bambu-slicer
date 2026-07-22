import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

import "./Tab.css";

export type TabProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  /** Tab label */
  children: ReactNode;
  /** Selected tab — shows brand bottom border and emphasis colors */
  active?: boolean;
  /** Ref to the rendered label, used by tab lists with a shared indicator. */
  labelRef?: Ref<HTMLSpanElement>;
  /** Hide the built-in underline when the tab list renders a shared indicator. */
  showIndicator?: boolean;
  /**
   * Use override (orange) content ramp instead of base greyscale.
   * Figma node 2750:8308 — "Override" column.
   */
  override?: boolean;
};

export function Tab({
  children,
  active = false,
  labelRef,
  showIndicator = true,
  override = false,
  className = "",
  type = "button",
  disabled,
  ...rest
}: TabProps) {
  const rootClass = [
    "tab",
    active ? "tab--active" : "",
    !showIndicator ? "tab--indicator-hidden" : "",
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
        <span className="tab__label" ref={labelRef}>
          {children}
        </span>
      </span>
    </button>
  );
}
