import { useCallback, useRef, useState } from "react";
import { AppHeader, type AppHeaderTab } from "./components/AppHeader/AppHeader";
import { FilamentSection } from "./components/FilamentSection/FilamentSection";
import { ProcessSection } from "./components/ProcessSection/ProcessSection";
import { PrinterSection } from "./components/PrinterSection/PrinterSection";
import { SettingsPage } from "./components/SettingsPage/SettingsPage";
import { Toolbar } from "./components/Toolbar/Toolbar";
import { DevicePage } from "./components/DevicePage/DevicePage";
import { MakerWorldPage } from "./components/MakerWorldPage/MakerWorldPage";
import { NewTabPage } from "./components/NewTabPage/NewTabPage";
import "./App.css";

const SIDEBAR_MIN_PX = 380;
const SIDEBAR_MAX_PX = 640;

type AppView = "project" | "printer" | "makerworld" | "settings" | "new";
type AppTab = AppHeaderTab & { view: AppView };

const initialTabs: AppTab[] = [
  { id: "project", title: "New Project", icon: "project", view: "project" },
  { id: "printer", title: "Bambu Lab P1S", icon: "printer", view: "printer" },
  { id: "makerworld", title: "MakerWorld", icon: "makerworld", view: "makerworld" },
  { id: "settings", title: "Settings", icon: "settings", view: "settings" },
];

export default function App() {
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [tabs, setTabs] = useState(initialTabs);
  const [activeTab, setActiveTab] = useState("project");
  const dragRef = useRef<{ startX: number; startW: number } | null>(null);
  const turntableRef = useRef<HTMLIFrameElement | null>(null);

  const addTab = () => {
    const id = "new-" + Date.now();
    const newTab: AppTab = { id, title: "New Tab", view: "new" };
    setTabs((current) => [...current, newTab]);
    setActiveTab(id);
  };

  const replaceActiveTab = (
    view: Exclude<AppView, "new">,
    title: string,
    icon: NonNullable<AppHeaderTab["icon"]>,
  ) => {
    setTabs((current) =>
      current.map((tab): AppTab =>
        tab.id === activeTab ? { ...tab, title, icon, view } : tab,
      ),
    );
  };

  const openProject = (title: string) => replaceActiveTab("project", title, "project");

  const renameProjectTab = (id: string, title: string) => {
    setTabs((current) =>
      current.map((tab) =>
        tab.id === id && tab.view === "project" ? { ...tab, title } : tab,
      ),
    );
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

  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  const activeView = activeTabData?.view ?? "project";

  return (
    <div className="app">
      <AppHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabSelect={setActiveTab}
        onTabClose={closeTab}
        onTabRename={renameProjectTab}
        onTabAdd={addTab}
      />
      <div className="app__workspace">
        {activeView === "settings" ? (
          <SettingsPage />
        ) : activeView === "makerworld" ? (
          <MakerWorldPage />
        ) : activeView === "printer" ? (
          <DevicePage printerName={activeTabData?.title} />
        ) : activeView === "new" ? (
          <NewTabPage
            key={activeTab}
            onOpenProject={openProject}
            onOpenPrinter={(printerName) =>
              replaceActiveTab("printer", printerName, "printer")
            }
            onOpenSettings={() => replaceActiveTab("settings", "Settings", "settings")}
          />
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
