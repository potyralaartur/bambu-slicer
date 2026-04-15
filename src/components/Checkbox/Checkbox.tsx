import type { InputHTMLAttributes } from "react";

import "./Checkbox.css";

/**
 * Figma: **Checkbox** component set (unchecked/checked × resting/hover/active).
 *
 * @see https://www.figma.com/design/0H1HmDgMDUddD0yCXV0WJj/Bambu-Slicer?node-id=2819-2764
 */
const FIGMA_CHECKBOX = {
  fileKey: "0H1HmDgMDUddD0yCXV0WJj",
  nodeId: "2819:2764",
} as const;

function CheckIcon() {
  return (
    <svg
      className="checkbox__check"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3.5 8.25 6.5 11.25 12.5 4.75"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
>;

export function Checkbox({ className = "", id, ...rest }: CheckboxProps) {
  const rootClass = ["checkbox", className].filter(Boolean).join(" ");

  return (
    <span
      className={rootClass}
      data-figma-file-key={FIGMA_CHECKBOX.fileKey}
      data-figma-node-id={FIGMA_CHECKBOX.nodeId}
    >
      <input id={id} type="checkbox" className="checkbox__input" {...rest} />
      <span className="checkbox__visual" aria-hidden>
        <span className="checkbox__box">
          <CheckIcon />
        </span>
      </span>
    </span>
  );
}
