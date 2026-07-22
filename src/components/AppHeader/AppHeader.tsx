import {
  Fragment,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { FigmaIcon } from "../../icons";
import { IconButton } from "../IconButton/IconButton";

import "./AppHeader.css";

export type AppHeaderTab = {
  id: string;
  title: string;
  icon?: "project" | "printer" | "makerworld" | "settings";
};

type AppHeaderProps = {
  tabs: AppHeaderTab[];
  activeTab: string;
  onTabSelect: (id: string) => void;
  onTabClose: (id: string) => void;
  onTabRename: (id: string, title: string) => void;
  onTabAdd: () => void;
};

function TabIcon({ type }: { type: NonNullable<AppHeaderTab["icon"]> }) {
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

  if (type === "makerworld") {
    return (
      <svg className="tab-icon" viewBox="0 0 20 20" aria-hidden="true">
        <path transform="translate(1 1)" d="M17.5414 1.72377L13.4031 0.103224L13.1391 0L12.8737 0.103224L8.99858 1.61911L5.12343 0.103224L4.8609 0L4.59763 0.103224L0.458534 1.72377L0 1.90351V16.0972L0.458534 16.2762L4.59763 17.8968L4.8609 18L5.12416 17.8968L9 16.3809L12.8751 17.8968L13.1391 18L13.4031 17.8968L17.5414 16.2762L18 16.0972V1.90351L17.5414 1.72377ZM13.1391 0.77382L17.2782 2.39509V8.25142L13.1391 6.63162V0.77382ZM9.26325 8.92208L13.1391 7.40616L17.0149 8.92208L17.2124 8.99925L17.0149 9.0765L13.1391 10.5924L9.26325 9.0765L9.06585 8.99925L9.26325 8.92208ZM4.8609 0.77382L9 2.39509V8.25142L4.8609 6.63089V0.77382ZM0.985778 8.92208L4.8609 7.40616L8.73675 8.92208L8.93415 8.99925L8.73675 9.0765L4.8609 10.5924L0.985778 9.0765L0.788333 8.99925L0.985778 8.92208ZM0.72324 15.6042V9.74498L4.86234 11.3647V17.2219L0.72324 15.6042ZM9.00142 15.6042V9.74498L13.1405 11.3647V17.2219L9.00142 15.6042Z" />
      </svg>
    );
  }

  return (
    <svg className="tab-icon" viewBox="0 0 20 20" aria-hidden="true">
      <path transform="translate(2.5 1.9123)" fillRule="evenodd" d="M0 5.31245c0-.90319.487161-1.73616 1.27436-2.17895L6.27436.321052a2.5 2.5 0 0 1 2.45128.000002l5.00006 2.812466A2.5 2.5 0 0 1 15 5.31247V10.863a2.5 2.5 0 0 1-1.2744 2.1789l-5 2.8125a2.5 2.5 0 0 1-2.45121 0l-4.99997-2.8122A2.5 2.5 0 0 1 0 10.8632V5.31245Zm4.58336 2.77512a2.91667 2.91667 0 1 1 5.83334 0 2.91667 2.91667 0 0 1-5.83334 0Z" />
    </svg>
  );
}

export function AppHeader({
  tabs,
  activeTab,
  onTabSelect,
  onTabClose,
  onTabRename,
  onTabAdd,
}: AppHeaderProps) {
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const cancelRenameRef = useRef(false);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  const beginRename = (
    event: ReactMouseEvent<HTMLSpanElement>,
    tab: AppHeaderTab,
  ) => {
    if (tab.icon !== "project") return;

    event.preventDefault();
    event.stopPropagation();
    onTabSelect(tab.id);
    cancelRenameRef.current = false;
    setDraftTitle(tab.title);
    setEditingTabId(tab.id);
  };

  const focusTab = (index: number) => {
    const tab = tabs[index];
    if (!tab) return;

    onTabSelect(tab.id);
    tabRefs.current.get(tab.id)?.focus();
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined;

    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === undefined) return;

    event.preventDefault();
    focusTab(nextIndex);
  };

  return (
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
      <IconButton aria-label="Notifications">
        <FigmaIcon name="bell" size={20} />
      </IconButton>
      <nav className="tab-bar" aria-label="Open tabs">
        <div className="tabs-viewport">
          <div className="tabs-track" role="tablist" aria-label="Bambu Slicer tabs">
            {tabs.map((tab, index) => (
              <Fragment key={tab.id}>
                {index > 0 && <span className="tab-separator" aria-hidden="true" />}
                <div
                  className={[
                    "app-tab",
                    tab.id === activeTab ? "is-active" : "",
                  ].filter(Boolean).join(" ")}
                >
                  {editingTabId === tab.id ? (
                    <div
                      className="tab-target tab-target--editing"
                      role="tab"
                      aria-selected="true"
                    >
                      {tab.icon ? <TabIcon type={tab.icon} /> : null}
                      <span className="tab-title-editor">
                        <span className="tab-title-measure" aria-hidden="true">
                          {draftTitle || "\u00a0"}
                        </span>
                        <input
                          autoFocus
                          className="tab-title-input"
                          value={draftTitle}
                          aria-label={`Rename ${tab.title}`}
                          onChange={(event) => setDraftTitle(event.currentTarget.value)}
                          onFocus={(event) => event.currentTarget.select()}
                          onBlur={() => {
                            if (!cancelRenameRef.current) {
                              const title = draftTitle.trim();
                              if (title) onTabRename(tab.id, title);
                            }
                            cancelRenameRef.current = false;
                            setEditingTabId(null);
                          }}
                          onKeyDown={(event) => {
                            event.stopPropagation();
                            if (event.key === "Enter") {
                              event.preventDefault();
                              event.currentTarget.blur();
                            } else if (event.key === "Escape") {
                              event.preventDefault();
                              cancelRenameRef.current = true;
                              event.currentTarget.blur();
                            }
                          }}
                        />
                      </span>
                    </div>
                  ) : (
                    <button
                      className="tab-target"
                      type="button"
                      role="tab"
                      aria-label={tab.title}
                      aria-selected={tab.id === activeTab}
                      tabIndex={tab.id === activeTab ? 0 : -1}
                      ref={(node) => {
                        if (node) tabRefs.current.set(tab.id, node);
                        else tabRefs.current.delete(tab.id);
                      }}
                      onClick={() => onTabSelect(tab.id)}
                      onKeyDown={(event) => onTabKeyDown(event, index)}
                    >
                      {tab.icon ? <TabIcon type={tab.icon} /> : null}
                      <span
                        className="tab-label"
                        onDoubleClick={(event) => beginRename(event, tab)}
                      >
                        {tab.title}
                      </span>
                    </button>
                  )}
                  <button
                    className="tab-close"
                    type="button"
                    aria-label={`Close ${tab.title}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onTabClose(tab.id);
                    }}
                  >
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path transform="translate(4.5834 4.5834)" d="M9.76639.183058a.625.625 0 0 1 .88381.883792L6.30041 5.41662l4.34979 4.34977a.625.625 0 0 1-.88381.88381L5.41662 6.30041 1.06685 10.6502a.625.625 0 1 1-.883792-.88381L4.53283 5.41662.183058 1.06685A.625.625 0 0 1 1.06685.183058L5.41662 4.53283 9.76639.183058Z" />
                    </svg>
                  </button>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        <span className="tab-separator tab-separator--add" aria-hidden="true" />
        <button className="add-tab" type="button" aria-label="Open a new tab" onClick={onTabAdd}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path transform="translate(3.75 3.75)" d="M5.625 11.875v-5H.625a.625.625 0 1 1 0-1.25h5v-5a.625.625 0 1 1 1.25 0v5h5a.625.625 0 1 1 0 1.25h-5v5a.625.625 0 1 1-1.25 0Z" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
