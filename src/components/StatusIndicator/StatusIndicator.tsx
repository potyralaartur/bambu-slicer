import "./StatusIndicator.css";

export type StatusTone = "positive" | "muted";

export type StatusIndicatorSize = "small" | "large";

export type StatusIndicatorProps = {
  label: string;
  tone?: StatusTone;
  /** `large` — page-header pill (Figma 9432:7236): 8px dot, 15px label. */
  size?: StatusIndicatorSize;
};

/** Figma 8900:3050 — 6px status dot with a 13px label. */
export function StatusIndicator({ label, tone = "positive", size = "small" }: StatusIndicatorProps) {
  return (
    <span className={`status-indicator status-indicator--${tone} status-indicator--${size}`}>
      <span className="status-indicator__dot" aria-hidden />
      <span className="status-indicator__label">{label}</span>
    </span>
  );
}
