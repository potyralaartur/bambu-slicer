import { useId, useState } from "react";

import { DropdownField } from "../DropdownField/DropdownField";
import { IconButton } from "../IconButton/IconButton";
import { LargeSelector } from "../LargeSelector/LargeSelector";
import { SectionHeader } from "../SectionHeader/SectionHeader";
import { CloudSyncIcon, HexGearIcon } from "../../icons/printerSectionIcons";

import "./PrinterSection.css";

const PRINTER_IMAGE = `${import.meta.env.BASE_URL}assets/large-selector/printer.png`;
const PLATE_IMAGE = `${import.meta.env.BASE_URL}assets/large-selector/pei-plate.png`;

export function PrinterSection() {
  const printerPanelId = useId();
  const [sectionExpanded, setSectionExpanded] = useState(true);
  const [printerOpen, setPrinterOpen] = useState(false);
  const [plateOpen, setPlateOpen] = useState(false);
  const [nozzleOpen, setNozzleOpen] = useState(false);
  const [flowOpen, setFlowOpen] = useState(false);

  return (
    <section
      className={[
        "printer-section",
        !sectionExpanded ? "printer-section--collapsed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Printer"
    >
      <SectionHeader
        title="Printer"
        collapsible
        expanded={sectionExpanded}
        onToggle={() => setSectionExpanded((open) => !open)}
        panelId={printerPanelId}
        showTrailingAction={false}
        ariaLabel="Printer section"
        endSlot={
          <>
            <IconButton aria-label="Cloud sync">
              <CloudSyncIcon />
            </IconButton>
            <IconButton aria-label="Printer settings">
              <HexGearIcon />
            </IconButton>
          </>
        }
      />
      <div
        id={printerPanelId}
        className="printer-section__panel"
        hidden={!sectionExpanded}
      >
        <div className="printer-section__selectors">
          <LargeSelector
            label="Bambu Lab P1S"
            imageSrc={PRINTER_IMAGE}
            active={printerOpen}
            aria-expanded={printerOpen}
            aria-haspopup="listbox"
            onClick={() => setPrinterOpen((open) => !open)}
          />
          <LargeSelector
            className="printer-section__plate"
            label="Textured PEI Plate"
            imageSrc={PLATE_IMAGE}
            active={plateOpen}
            aria-expanded={plateOpen}
            aria-haspopup="listbox"
            onClick={() => setPlateOpen((open) => !open)}
          />
        </div>
        <div className="printer-section__statuses">
          <DropdownField
            label="Nozzle diameter"
            value="0.4 mm"
            active={nozzleOpen}
            aria-expanded={nozzleOpen}
            aria-haspopup="listbox"
            onClick={() => setNozzleOpen((open) => !open)}
          />
          <DropdownField
            label="Flow"
            value="Standard"
            active={flowOpen}
            aria-expanded={flowOpen}
            aria-haspopup="listbox"
            onClick={() => setFlowOpen((open) => !open)}
          />
        </div>
      </div>
    </section>
  );
}
