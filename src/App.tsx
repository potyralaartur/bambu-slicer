import { Fragment, useCallback, useRef, useState } from "react";
import { FilamentSection } from "./components/FilamentSection/FilamentSection";
import { ProcessSection } from "./components/ProcessSection/ProcessSection";
import { PrinterSection } from "./components/PrinterSection/PrinterSection";
import { Toolbar } from "./components/Toolbar/Toolbar";
import { FigmaIcon } from "./icons";
import "./App.css";

const SIDEBAR_MIN_PX = 380;
const SIDEBAR_MAX_PX = 640;

type Tab = {
  id: string;
  title: string;
  icon: "project" | "printer" | "settings";
};

const initialTabs: Tab[] = [
  { id: "project", title: "New Project", icon: "project" },
  { id: "printer", title: "Bambu Lab P1S", icon: "printer" },
  { id: "settings", title: "Settings", icon: "settings" },
];

function TabIcon({ type }: { type: Tab["icon"] }) {
  if (type === "project") {
    return (
      <svg className="tab-icon" viewBox="0 0 20 20" aria-hidden="true">
        <g transform="translate(4.16665 2.5)">
          <path d="M5.83333 0H2.1875C.979377 0 0 1.00736 0 2.25v10.5C0 13.9926.979377 15 2.1875 15h7.29167c1.20813 0 2.18753-1.0074 2.18753-2.25V6H8.02083c-1.20812 0-2.1875-1.00736-2.1875-2.25V0Z" />
          <path d="m11.2395 4.5-3.94783-4.06066V3.75c0 .41421.32646.75.72916.75h3.21867Z" />
        </g>
      </svg>
    );
  }
  if (type === "printer") {
    return (
      <svg className="tab-icon" viewBox="0 0 20 20" aria-hidden="true">
        <g transform="translate(2.5 1.42855)">
          <path fillRule="evenodd" d="M12.8571 0A2.14286 2.14286 0 0 1 15 2.14286V15a2.14286 2.14286 0 0 1-2.1429 2.1429H2.14286A2.14286 2.14286 0 0 1 0 15V2.14286A2.14286 2.14286 0 0 1 2.14286 0H12.8571ZM2.67857 1.60714c-.59173 0-1.07143.4797-1.07143 1.07143v9.64283c0 .5918.4797 1.0715 1.07143 1.0715h9.64283c.5918 0 1.0715-.4797 1.0715-1.0715V2.67857c0-.59173-.4797-1.07143-1.0715-1.07143H2.67857Z" />
          <path fillRule="evenodd" d="M15 7.32143H0v-1.875h15v1.875Z" />
          <path d="M8.64583 2.94643c.92048 0 1.66667.74619 1.66667 1.66667v2.91666c0 .92048-.74619 1.66667-1.66667 1.66667H6.35417c-.92048 0-1.66667-.74619-1.66667-1.66667V4.6131c0-.92048.74619-1.66667 1.66667-1.66667h2.29166Z" />
          <path d="M6.5625 10.2377V8.57143h1.875v1.66627a.9375.9375 0 0 1-1.875 0Z" />
        </g>
      </svg>
    );
  }
  return (
    <svg className="tab-icon" viewBox="0 0 20 20" aria-hidden="true">
      <path transform="translate(2.5 1.9123)" fillRule="evenodd" d="M0 5.31245c0-.90319.487161-1.73616 1.27436-2.17895L6.27436.321052a2.5 2.5 0 0 1 2.45128.000002l5.00006 2.812466A2.5 2.5 0 0 1 15 5.31247V10.863a2.5 2.5 0 0 1-1.2744 2.1789l-5 2.8125a2.5 2.5 0 0 1-2.45121 0l-4.99997-2.8122A2.5 2.5 0 0 1 0 10.8632V5.31245Zm4.58336 2.77512a2.91667 2.91667 0 1 1 5.83334 0 2.91667 2.91667 0 0 1-5.83334 0Z" />
    </svg>
  );
}

export default function App() {
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [tabs, setTabs] = useState(initialTabs);
  const [activeTab, setActiveTab] = useState("project");
  const dragRef = useRef<{ startX: number; startW: number } | null>(null);
  const turntableRef = useRef<HTMLIFrameElement | null>(null);

  const addTab = () => {
    const id = `project-${Date.now()}`;
    setTabs((current) => [...current, { id, title: "New Project", icon: "project" }]);
    setActiveTab(id);
  };

  const closeTab = (id: string) => {
    setTabs((current) => {
      if (current.length === 1) return current;
      const tabIndex = current.findIndex((tab) => tab.id === id);
      const nextTabs = current.filter((tab) => tab.id !== id);
      if (id === activeTab) {
        setActiveTab(nextTabs[Math.max(0, tabIndex - 1)]?.id ?? nextTabs[0].id);
      }
      return nextTabs;
    });
  };

  const onResizePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = { startX: e.clientX, startW: sidebarWidth };
      setIsResizing(true);
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
    setIsResizing(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  const onImportModel = useCallback(() => {
    turntableRef.current?.contentDocument
      ?.querySelector<HTMLInputElement>("#stlInput")
      ?.click();
  }, []);

  return (
    <div className="app">
      <header className="app-header" aria-label="Application header">
        <div className="traffic-lights" aria-hidden="true">
          <span className="traffic-light traffic-light--close" />
          <span className="traffic-light traffic-light--minimize" />
          <span className="traffic-light traffic-light--maximize" />
        </div>
        <div className="header-history" role="group" aria-label="History">
          <button className="header-history__button" type="button" aria-label="Undo">
            <FigmaIcon name="arrow-left" size={20} />
          </button>
          <button className="header-history__button" type="button" aria-label="Redo" disabled>
            <FigmaIcon name="arrow-right" size={20} />
          </button>
        </div>
        <nav className="tab-bar" aria-label="Open tabs">
          <div className="tabs-viewport">
            <div className="tabs-track" role="tablist" aria-label="Bambu Slicer tabs">
              {tabs.map((tab, index) => (
                <Fragment key={tab.id}>
                  {index > 0 && <span className="tab-separator" aria-hidden="true" />}
                  <div className={`app-tab ${tab.id === activeTab ? "is-active" : ""}`}>
              <button
                className="tab-target"
                role="tab"
                aria-selected={tab.id === activeTab}
                onClick={() => setActiveTab(tab.id)}
              >
                <TabIcon type={tab.icon} />
                <span className="tab-label">{tab.title}</span>
              </button>
              <button
                  className="tab-close"
                  type="button"
                  aria-label={`Close ${tab.title}`}
                  onClick={(event) => { event.stopPropagation(); closeTab(tab.id); }}
                >
                  <svg viewBox="0 0 20 20" aria-hidden="true"><path transform="translate(4.5834 4.5834)" d="M9.76639.183058a.625.625 0 0 1 .88381.883792L6.30041 5.41662l4.34979 4.34977a.625.625 0 0 1-.88381.88381L5.41662 6.30041 1.06685 10.6502a.625.625 0 1 1-.883792-.88381L4.53283 5.41662.183058 1.06685A.625.625 0 0 1 1.06685.183058L5.41662 4.53283 9.76639.183058Z" /></svg>
              </button>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
          <span className="tab-separator tab-separator--add" aria-hidden="true" />
          <button className="add-tab" type="button" aria-label="Open a new tab" onClick={addTab}>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path transform="translate(3.75 3.75)" d="M5.625 11.875v-5H.625a.625.625 0 1 1 0-1.25h5v-5a.625.625 0 1 1 1.25 0v5h5a.625.625 0 1 1 0 1.25h-5v5a.625.625 0 1 1-1.25 0Z" /></svg>
          </button>
        </nav>
      </header>
      <div className="app__workspace">
        <aside
          className="app__sidebar"
          aria-label="Sidebar"
          style={{ width: sidebarWidth }}
        >
          <PrinterSection />
          <FilamentSection />
          <ProcessSection />
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
        </aside>
        <main className="app__main">
          <Toolbar onImportModel={onImportModel} />
          <div className="app__main-content" aria-label="Build plate canvas">
            <iframe
              ref={turntableRef}
              className="app__turntable"
              src={`${import.meta.env.BASE_URL}turntable/index.html`}
              title="Interactive build plate"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
