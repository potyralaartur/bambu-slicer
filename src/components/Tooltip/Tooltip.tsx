import type { HTMLAttributes, ReactNode } from "react";

import "./Tooltip.css";

/**
 * Figma: **Tooltip** (caret up — use when the bubble sits below its anchor).
 *
 * @see https://www.figma.com/design/0H1HmDgMDUddD0yCXV0WJj/Bambu-Slicer?node-id=2681-2450
 *
 * Presentational only: position with a parent (`position: relative` on the anchor +
 * `absolute` on this root). Pair the anchor with `aria-describedby` pointing at
 * the optional `id` on this node when the tooltip is visible.
 */
const FIGMA_TOOLTIP = {
  fileKey: "0H1HmDgMDUddD0yCXV0WJj",
  nodeId: "2681:2450",
} as const;

export type TooltipProps = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "className" | "children">;

export function Tooltip({ children, className = "", id, ...rest }: TooltipProps) {
  const rootClass = ["tooltip", className].filter(Boolean).join(" ");

  return (
    <div
      id={id}
      className={rootClass}
      data-figma-file-key={FIGMA_TOOLTIP.fileKey}
      data-figma-node-id={FIGMA_TOOLTIP.nodeId}
      {...rest}
    >
      <div className="tooltip__caret" aria-hidden>
        <svg
          className="tooltip__caret-svg"
          width={10}
          height={5}
          viewBox="0 0 10 5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 0.5 L9.75 5 H0.25 L5 0.5Z"
            fill="var(--color-greyscale-50)"
            stroke="var(--color-greyscale-300)"
            strokeWidth="var(--border-width-1)"
            strokeLinejoin="miter"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div className="tooltip__body">
        <div className="tooltip__text">{children}</div>
      </div>
    </div>
  );
}
