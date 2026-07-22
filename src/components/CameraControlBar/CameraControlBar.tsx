import { FigmaIcon } from "../../icons/FigmaIcon";
import { IconButton } from "../IconButton/IconButton";

import "./CameraControlBar.css";

/**
 * Figma 8998:2533 — Camera Control Bar.
 * A floating cluster of icon-only controls over the build-plate canvas:
 * light-bulb, minus (zoom out), plus (zoom in), resize (fit view).
 * Uses the IconButton `overlay` variant so glyphs read against the dark
 * translucent bar.
 */

export type CameraControlBarProps = {
  className?: string;
  onToggleLight?: () => void;
  onZoomOut?: () => void;
  onZoomIn?: () => void;
  onFitView?: () => void;
};

export function CameraControlBar({
  className = "",
  onToggleLight,
  onZoomOut,
  onZoomIn,
  onFitView,
}: CameraControlBarProps) {
  const rootClass = ["camera-control-bar", className].filter(Boolean).join(" ");

  return (
    <div className={rootClass} role="toolbar" aria-label="Camera controls">
      <IconButton variant="overlay" aria-label="Toggle light" onClick={onToggleLight}>
        <FigmaIcon name="light-bulb" size={20} />
      </IconButton>
      <IconButton variant="overlay" aria-label="Zoom out" onClick={onZoomOut}>
        <FigmaIcon name="minus" size={20} />
      </IconButton>
      <IconButton variant="overlay" aria-label="Zoom in" onClick={onZoomIn}>
        <FigmaIcon name="plus" size={20} />
      </IconButton>
      <IconButton variant="overlay" aria-label="Fit view" onClick={onFitView}>
        <FigmaIcon name="resize" size={20} />
      </IconButton>
    </div>
  );
}
