import { useCallback, useRef, useState } from "react";

import { DeviceCamera } from "../DeviceCamera/DeviceCamera";
import { DeviceSidebar } from "../DeviceSidebar/DeviceSidebar";

import "./DevicePage.css";

const SIDEBAR_MIN_PX = 380;
const SIDEBAR_MAX_PX = 640;

export type DevicePageProps = {
  printerName?: string;
};

export function DevicePage({ printerName = "Bambu Lab P1S" }: DevicePageProps) {
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_MIN_PX);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef<{ startX: number; startW: number } | null>(null);

  const onResizePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = { startX: event.clientX, startW: sidebarWidth };
      setIsResizing(true);
    },
    [sidebarWidth],
  );

  const onResizePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;

    const delta = event.clientX - dragRef.current.startX;
    const nextWidth = Math.min(
      SIDEBAR_MAX_PX,
      Math.max(SIDEBAR_MIN_PX, dragRef.current.startW + delta),
    );
    setSidebarWidth(nextWidth);
  }, []);

  const onResizePointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    setIsResizing(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  return (
    <section className="device-page" aria-label="Device">
      <div className="device-page__sidebar" style={{ width: sidebarWidth }}>
        <DeviceSidebar printerName={printerName} />
        <div
          className={[
            "app__sidebar-resize-handle",
            isResizing ? "app__sidebar-resize-handle--dragging" : "",
          ].filter(Boolean).join(" ")}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
          aria-valuemin={SIDEBAR_MIN_PX}
          aria-valuemax={SIDEBAR_MAX_PX}
          aria-valuenow={sidebarWidth}
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
          onPointerCancel={onResizePointerUp}
        />
      </div>
      <DeviceCamera />
    </section>
  );
}
