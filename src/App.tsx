import { useState } from "react";

import { DropdownField } from "./components/DropdownField/DropdownField";
import { LargeSelector } from "./components/LargeSelector/LargeSelector";
import { SectionHeader } from "./components/SectionHeader/SectionHeader";
import "./App.css";

export default function App() {
  const [printerOpen, setPrinterOpen] = useState(false);
  const [infillOpen, setInfillOpen] = useState(false);

  return (
    <div className="app">
      <aside className="app__sidebar" aria-label="Project panel">
        <SectionHeader
          title="Project"
          collapsible
          ariaLabel="Project section"
          trailingActionAriaLabel="Project options"
        />
        <div className="app__printer-select">
          <LargeSelector
            label="Bambu Lab P1S"
            active={printerOpen}
            aria-expanded={printerOpen}
            aria-haspopup="listbox"
            onClick={() => setPrinterOpen((open) => !open)}
          />
        </div>
        <div className="app__dropdown-field">
          <DropdownField
            label="Infill pattern"
            value="Honeycomb"
            showPattern
            showMore
            active={infillOpen}
            aria-expanded={infillOpen}
            aria-haspopup="listbox"
            onClick={() => setInfillOpen((open) => !open)}
          />
        </div>
      </aside>
      <main className="app__main">
        <h1 className="app__title">Bambu Slicer</h1>
        <p className="app__subtitle">React dev environment is ready.</p>
      </main>
    </div>
  );
}
