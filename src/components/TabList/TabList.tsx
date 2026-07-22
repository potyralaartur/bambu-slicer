import { useCallback, useEffect, useRef, useState } from "react";

import { Tab } from "../Tab/Tab";

import "./TabList.css";

export type TabListProps<T extends string> = {
  tabs: readonly T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  ariaLabel: string;
  className?: string;
  tabClassName?: string;
  id?: string;
  getTabId?: (tab: T) => string;
  getTabPanelId?: (tab: T) => string;
};

export function TabList<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel,
  className = "",
  tabClassName = "",
  id,
  getTabId,
  getTabPanelId,
}: TabListProps<T>) {
  const tabListRef = useRef<HTMLDivElement | null>(null);
  const labelRefs = useRef<Partial<Record<T, HTMLSpanElement | null>>>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const activeLabel = labelRefs.current[activeTab];
    const tabList = tabListRef.current;
    if (!activeLabel || !tabList) {
      return;
    }

    const labelRect = activeLabel.getBoundingClientRect();
    const tabListRect = tabList.getBoundingClientRect();
    setIndicatorStyle({
      left: labelRect.left - tabListRect.left,
      width: labelRect.width,
    });
  }, [activeTab]);

  useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useEffect(() => {
    const tabList = tabListRef.current;
    if (!tabList) {
      return;
    }

    const resizeObserver = new ResizeObserver(updateIndicator);
    resizeObserver.observe(tabList);
    return () => resizeObserver.disconnect();
  }, [updateIndicator]);

  return (
    <div
      className={["tab-list", className].filter(Boolean).join(" ")}
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      id={id}
      ref={tabListRef}
    >
      {tabs.map((tab) => {
        const selected = activeTab === tab;
        return (
          <Tab
            key={tab}
            role="tab"
            id={getTabId?.(tab)}
            aria-selected={selected}
            aria-controls={getTabPanelId?.(tab)}
            tabIndex={selected ? 0 : -1}
            className={tabClassName}
            active={selected}
            showIndicator={false}
            onClick={() => onTabChange(tab)}
            labelRef={(element) => {
              labelRefs.current[tab] = element;
            }}
          >
            {tab}
          </Tab>
        );
      })}
      <span
        className="tab-list__indicator"
        aria-hidden
        style={{
          width: `${indicatorStyle.width}px`,
          transform: `translateX(${indicatorStyle.left}px)`,
        }}
      />
    </div>
  );
}
