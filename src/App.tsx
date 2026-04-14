import { SectionHeader } from "./components/SectionHeader/SectionHeader";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <aside className="app__sidebar" aria-label="Project panel">
        <SectionHeader
          title="Project"
          collapsible
          ariaLabel="Project section"
          trailingActionAriaLabel="Project options"
        />
      </aside>
      <main className="app__main">
        <h1 className="app__title">Bambu Slicer</h1>
        <p className="app__subtitle">React dev environment is ready.</p>
      </main>
    </div>
  );
}
