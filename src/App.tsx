import { useCallback, useRef, useState } from "react";
import { FilamentSection } from "./components/FilamentSection/FilamentSection";
import { ProcessSection } from "./components/ProcessSection/ProcessSection";
import { PrinterSection } from "./components/PrinterSection/PrinterSection";
import "./App.css";

const SIDEBAR_MIN_PX = 380;
const SIDEBAR_MAX_PX = 640;

export default function App() {
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const dragRef = useRef<{ startX: number; startW: number } | null>(null);

  const onResizePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = { startX: e.clientX, startW: sidebarWidth };
    },
    [sidebarWidth]
  );

  const onResizePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const delta = e.clientX - dragRef.current.startX;
    const next = Math.min(
      SIDEBAR_MAX_PX,
      Math.max(SIDEBAR_MIN_PX, dragRef.current.startW + delta)
    );
    setSidebarWidth(next);
  }, []);

  const onResizePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  return (
    <div className="app">
      <aside
        className="app__sidebar"
        aria-label="Sidebar"
        style={{ width: sidebarWidth }}
      >
        <PrinterSection />
        <FilamentSection />
        <ProcessSection />
        <div
          className="app__sidebar-resize-handle"
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
      </aside>
      <main className="app__main">
        <h1 className="app__title">Bambu Slicer</h1>
        <p className="app__subtitle">React dev environment is ready.</p>
      </main>
    </div>
  );
}
