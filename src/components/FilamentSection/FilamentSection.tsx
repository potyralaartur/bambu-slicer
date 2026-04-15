import { useId, useState } from "react";

import { FilamentField } from "../FilamentField/FilamentField";
import { IconButton } from "../IconButton/IconButton";
import { SectionHeader } from "../SectionHeader/SectionHeader";
import { CloudSyncIcon, HexGearIcon, PlusIcon } from "../../icons/printerSectionIcons";

import "./FilamentSection.css";

/**
 * Figma: **Sidebar Actions** — Filament block.
 *
 * @see https://www.figma.com/design/0H1HmDgMDUddD0yCXV0WJj/Bambu-Slicer?node-id=2073-1579
 */
const FIGMA_FILAMENT_SECTION = {
  fileKey: "0H1HmDgMDUddD0yCXV0WJj",
  nodeId: "2073:1579",
} as const;

export function FilamentSection() {
  const filamentPanelId = useId();
  const [sectionExpanded, setSectionExpanded] = useState(true);
  const [openSlot, setOpenSlot] = useState<number | null>(null);

  const toggleSlot = (index: number) => {
    setOpenSlot((current) => (current === index ? null : index));
  };

  return (
    <section
      className={[
        "filament-section",
        !sectionExpanded ? "filament-section--collapsed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Filament"
      data-figma-file-key={FIGMA_FILAMENT_SECTION.fileKey}
      data-figma-node-id={FIGMA_FILAMENT_SECTION.nodeId}
    >
      <SectionHeader
        className="section-header--filament-trailing"
        title="Filament"
        collapsible
        expanded={sectionExpanded}
        onToggle={() => setSectionExpanded((open) => !open)}
        panelId={filamentPanelId}
        showTrailingAction={false}
        ariaLabel="Filament section"
        endSlot={
          <>
            <IconButton aria-label="Add filament">
              <PlusIcon />
            </IconButton>
            <IconButton aria-label="Cloud sync">
              <CloudSyncIcon />
            </IconButton>
            <IconButton aria-label="Filament settings">
              <HexGearIcon />
            </IconButton>
          </>
        }
      />
      <div
        id={filamentPanelId}
        className="filament-section__panel"
        hidden={!sectionExpanded}
      >
        <div className="filament-section__grid">
          <FilamentField
            slot="1"
            slotTone="default"
            value="PLA Sparkle"
            showMore={false}
            active={openSlot === 1}
            aria-expanded={openSlot === 1}
            aria-haspopup="listbox"
            onClick={() => toggleSlot(1)}
          />
          <FilamentField
            slot="2"
            slotTone="silver"
            value="PLA Matte"
            showMore={false}
            active={openSlot === 2}
            aria-expanded={openSlot === 2}
            aria-haspopup="listbox"
            onClick={() => toggleSlot(2)}
          />
          <FilamentField
            slot="3"
            slotTone="black"
            value="PLA Matte"
            showMore={false}
            active={openSlot === 3}
            aria-expanded={openSlot === 3}
            aria-haspopup="listbox"
            onClick={() => toggleSlot(3)}
          />
          <FilamentField
            slot="4"
            slotTone="white"
            value="PLA Matte"
            showMore={false}
            active={openSlot === 4}
            aria-expanded={openSlot === 4}
            aria-haspopup="listbox"
            onClick={() => toggleSlot(4)}
          />
        </div>
      </div>
    </section>
  );
}
