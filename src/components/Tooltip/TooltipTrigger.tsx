import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import { Tooltip } from "./Tooltip";

import "./TooltipTrigger.css";

/** Figma toolbar tooltips appear after a short hover delay. */
const DEFAULT_DELAY_MS = 500;

export type TooltipTriggerProps = {
  label: ReactNode;
  children: ReactElement<{
    onFocus?: (event: FocusEvent<HTMLElement>) => void;
    onBlur?: (event: FocusEvent<HTMLElement>) => void;
  }>;
  /** Hover delay before the tooltip is shown. Default 500ms. */
  delayMs?: number;
  className?: string;
};

export function TooltipTrigger({
  label,
  children,
  delayMs = DEFAULT_DELAY_MS,
  className = "",
}: TooltipTriggerProps) {
  const tooltipId = useId();
  const [visible, setVisible] = useState(false);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearShowTimer = useCallback(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);

  const hide = useCallback(() => {
    clearShowTimer();
    setVisible(false);
  }, [clearShowTimer]);

  const scheduleShow = useCallback(
    (immediate = false) => {
      clearShowTimer();
      if (immediate) {
        setVisible(true);
        return;
      }
      showTimerRef.current = setTimeout(() => setVisible(true), delayMs);
    },
    [clearShowTimer, delayMs]
  );

  useEffect(() => () => clearShowTimer(), [clearShowTimer]);

  const rootClass = ["tooltip-trigger", className].filter(Boolean).join(" ");

  const trigger = cloneElement(children, {
    ...(visible ? { "aria-describedby": tooltipId } : {}),
    onFocus: (e: FocusEvent<HTMLElement>) => {
      children.props.onFocus?.(e);
      scheduleShow(true);
    },
    onBlur: (e: FocusEvent<HTMLElement>) => {
      children.props.onBlur?.(e);
      hide();
    },
  });

  return (
    <div
      className={rootClass}
      onPointerEnter={() => scheduleShow(false)}
      onPointerLeave={hide}
    >
      {trigger}
      {visible && (
        <Tooltip id={tooltipId} role="tooltip" className="tooltip-trigger__popup">
          {label}
        </Tooltip>
      )}
    </div>
  );
}
