import { useId, useState } from "react";

import { DropdownField } from "../DropdownField/DropdownField";
import { IconButton } from "../IconButton/IconButton";
import { SectionHeader } from "../SectionHeader/SectionHeader";
import { TabList } from "../TabList/TabList";
import { HexGearIcon, LightBulbIcon } from "../../icons/printerSectionIcons";

import { OtherTabPanel } from "./OtherTabPanel";
import { QualityTabPanel } from "./QualityTabPanel";
import { SpeedTabPanel } from "./SpeedTabPanel";
import { StrengthTabPanel } from "./StrengthTabPanel";
import { SupportTabPanel } from "./SupportTabPanel";

import "./ProcessSection.css";

/**
 * Figma: **Sidebar Footer** — Process block.
 *
 * @see https://www.figma.com/design/0H1HmDgMDUddD0yCXV0WJj/Bambu-Slicer?node-id=2073-1594
 */
const FIGMA_PROCESS_SECTION = {
  fileKey: "0H1HmDgMDUddD0yCXV0WJj",
  nodeId: "2073:1594",
} as const;

const PROCESS_TABS = ["Quality", "Strength", "Speed", "Support", "Other"] as const;

const TAB_PANELS = {
  Quality: QualityTabPanel,
  Strength: StrengthTabPanel,
  Speed: SpeedTabPanel,
  Support: SupportTabPanel,
  Other: OtherTabPanel,
} as const;

export type ProcessTabId = (typeof PROCESS_TABS)[number];

function tabId(tab: ProcessTabId) {
  return `process-tab-${tab.toLowerCase().replace(/\s+/g, "-")}`;
}

function tabPanelId(tab: ProcessTabId) {
  return `process-tabpanel-${tab.toLowerCase().replace(/\s+/g, "-")}`;
}

export function ProcessSection() {
  const [presetOpen, setPresetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ProcessTabId>("Quality");
  const [advancedColor, setAdvancedColor] = useState<"brand" | "base">("brand");
  const tabGroupId = useId();

  return (
    <section
      className="process-section"
      aria-label="Process"
      data-figma-file-key={FIGMA_PROCESS_SECTION.fileKey}
      data-figma-node-id={FIGMA_PROCESS_SECTION.nodeId}
    >
      <div className="process-section__controls">
        <SectionHeader
          className="section-header--process-trailing"
          title="Process"
          collapsible={false}
          ariaLabel="Process section"
          trailingActionAriaLabel="Process locale or web presets"
          endSlot={
            <>
              <button
                type="button"
                className={`process-section__advanced process-section__advanced--${advancedColor}`}
                onClick={() =>
                  setAdvancedColor((c) => (c === "brand" ? "base" : "brand"))
                }
              >
                <span className="process-section__advanced-icon" aria-hidden>
                  <LightBulbIcon />
                </span>
                <span className="process-section__advanced-label">Advanced</span>
              </button>
              <IconButton aria-label="Process settings">
                <HexGearIcon />
              </IconButton>
            </>
          }
        />
        {/* Same DropdownField + open-state pattern as PrinterSection (`printer-section__statuses`). */}
        <div className="process-section__statuses">
          <DropdownField
            label="Preset"
            value="0.20 mm Standard"
            active={presetOpen}
            aria-expanded={presetOpen}
            aria-haspopup="listbox"
            onClick={() => setPresetOpen((open) => !open)}
          />
        </div>
        <TabList
          className="process-section__tabs"
          tabClassName="process-section__tab"
          tabs={PROCESS_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="Process categories"
          id={tabGroupId}
          getTabId={tabId}
          getTabPanelId={tabPanelId}
        />
      </div>
      {/* Scrollable tab content (e.g. Layer height onward) — not part of `process-section__controls` */}
      <div className="process-section__panels">
        {PROCESS_TABS.map((tab) => {
          const TabPanel = TAB_PANELS[tab];
          return (
            <div
              key={tab}
              role="tabpanel"
              id={tabPanelId(tab)}
              className="process-section__tab-panel"
              aria-labelledby={tabId(tab)}
              hidden={activeTab !== tab}
            >
              <TabPanel />
            </div>
          );
        })}
      </div>
    </section>
  );
}
