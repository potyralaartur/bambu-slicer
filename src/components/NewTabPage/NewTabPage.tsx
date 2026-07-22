import { useEffect, useRef, useState } from "react";

import { FigmaIcon } from "../../icons";
import { Button } from "../Button/Button";
import { NewTabIcon } from "../NewTabIcon/NewTabIcon";
import { NewTabSearch } from "../NewTabSearch/NewTabSearch";
import { PrinterRow } from "../PrinterRow/PrinterRow";
import { ProductCard } from "../ProductCard/ProductCard";
import { ProjectCard } from "../ProjectCard/ProjectCard";
import { SettingsCard } from "../SettingsCard/SettingsCard";

import "./NewTabPage.css";

const RAW_BASE = import.meta.env.BASE_URL;
const BASE = RAW_BASE.endsWith("/") ? RAW_BASE.slice(0, -1) : RAW_BASE;
const assetUrl = (path: string) => BASE + "/assets/" + path;

const PRINTERS = [
  {
    name: "Bambu Lab P1S",
    details: "Printing · Benchy_v2.3mf · 62% · 1 h 24 m left",
    image: assetUrl("settings/printer-p1s.png"),
    status: { label: "Printing" },
  },
  {
    name: "Bambu Lab A1 mini",
    details: "A1 mini · 0.4 mm nozzle · Cloud",
    image: assetUrl("settings/printer-a1mini.png"),
    thumbnailCrop: "a1-mini" as const,
    status: { label: "Online" },
  },
];

const RECENT_PROJECTS = [
  { title: "Benchy_v2.3mf", edited: "Edited 2 h ago", image: "benchy.png" },
  { title: "Phone Stand v4", edited: "Edited yesterday", image: "phone-stand.png" },
  {
    title: "AMS Spool Holder",
    edited: "Edited 2 days ago",
    image: "ams-spool-holder.png",
  },
  {
    title: "Voronoi Lamp Shade",
    edited: "Edited 4 days ago",
    image: "voronoi-lamp.png",
  },
  { title: "Cable Clips x12", edited: "Edited last week", image: "cable-clips.png" },
  { title: "Drawer Organizer", edited: "Edited Jul 8", image: "drawer-organizer.png" },
].map((project) => ({
  ...project,
  image: assetUrl("new-tab/recent-projects/" + project.image),
}));

const MAKERWORLD_MODELS = [
  {
    title: "40k Warbringer Nemesis Titan",
    creator: "Grayson Portman",
    image: "warbringer.png",
    likes: 39,
    downloads: 91,
  },
  {
    title: "Ozzy Osbourne - Headphone Holder",
    creator: "ACSPARK3D",
    image: "ozzy.png",
    likes: 180,
    downloads: 361,
  },
  {
    title: "Flower-shaped Jewelry Box",
    creator: "Fem3D",
    image: "jewelry-box.png",
    likes: 67,
    downloads: 38,
  },
  {
    title: "Wooden Buddha Statue",
    creator: "GeniusPrint",
    image: "buddha.png",
    likes: 32,
    downloads: 24,
  },
  {
    title: "Tabletop Virtual Pinball Machine",
    creator: "3DJustin",
    image: "pinball.png",
    likes: 18,
    downloads: 9,
  },
  {
    title: "Ford Model A",
    creator: "Shapr3D",
    image: "ford-model-a.png",
    likes: 32,
    downloads: 67,
  },
].map((model) => ({
  ...model,
  image: assetUrl("new-tab/makerworld/" + model.image),
}));

export type NewTabPageProps = {
  onOpenProject: (title: string) => void;
  onOpenPrinter: (printerName: string) => void;
  onOpenSettings: () => void;
};

export function NewTabPage({
  onOpenProject,
  onOpenPrinter,
  onOpenSettings,
}: NewTabPageProps) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const recentProjectsRef = useRef<HTMLElement>(null);
  const makerWorldRef = useRef<HTMLElement>(null);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matches = (...parts: string[]) =>
    normalizedQuery.length === 0 ||
    parts.some((part) => part.toLocaleLowerCase().includes(normalizedQuery));
  const revealSection = (section: HTMLElement | null) => {
    setQuery("");
    requestAnimationFrame(() => section?.scrollIntoView({ behavior: "smooth" }));
  };

  const filteredPrinters = PRINTERS.filter((printer) =>
    matches(printer.name, printer.details, printer.status.label),
  );
  const filteredProjects = RECENT_PROJECTS.filter((project) =>
    matches(project.title, project.edited),
  );
  const filteredModels = MAKERWORLD_MODELS.filter((model) =>
    matches(model.title, model.creator),
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="new-tab-page" aria-label="New tab">
      <div className="new-tab-page__content">
        <section className="new-tab-page__intro" aria-label="Quick actions and search">
          <div className="new-tab-page__quick-actions" role="group" aria-label="Quick actions">
            <Button
              variant="secondary"
              color="brand"
              leftIcon={<NewTabIcon name="file-new" size={20} />}
              rightIcon={false}
              onClick={() => onOpenProject("New Project")}
            >
              New project
            </Button>
            <Button
              variant="secondary"
              color="warning"
              leftIcon={<NewTabIcon name="maker-world" size={20} />}
              rightIcon={false}
              onClick={() => revealSection(makerWorldRef.current)}
            >
              MakerWorld
            </Button>
            <Button
              variant="secondary"
              color="base"
              leftIcon={<FigmaIcon name="gear" size={20} />}
              rightIcon={false}
              onClick={onOpenSettings}
            >
              Settings
            </Button>
          </div>
          <NewTabSearch ref={searchRef} value={query} onChange={setQuery} />
        </section>

        <section
          className="new-tab-page__section new-tab-page__section--printers"
          aria-labelledby="new-tab-printers-title"
        >
          <div className="new-tab-page__section-header-row">
            <div className="new-tab-page__section-heading">
              <h2 id="new-tab-printers-title">Printers</h2>
            </div>
            <Button
              color="base"
              leftIcon={false}
              rightIcon={<FigmaIcon name="chevron-right-small" size={20} />}
              onClick={onOpenSettings}
            >
              Manage
            </Button>
          </div>
          {filteredPrinters.length > 0 ? (
            <SettingsCard>
              {filteredPrinters.map((printer) => (
                <PrinterRow
                  key={printer.name}
                  {...printer}
                  onClick={() => onOpenPrinter(printer.name)}
                />
              ))}
            </SettingsCard>
          ) : (
            <p className="new-tab-page__empty">No printers match your search.</p>
          )}
        </section>

        <section
          ref={recentProjectsRef}
          className="new-tab-page__section"
          aria-labelledby="new-tab-projects-title"
        >
          <div className="new-tab-page__section-header-row">
            <div className="new-tab-page__section-heading">
              <h2 id="new-tab-projects-title">Recent projects</h2>
            </div>
            <Button
              color="base"
              leftIcon={false}
              rightIcon={<FigmaIcon name="chevron-right-small" size={20} />}
              onClick={() => revealSection(recentProjectsRef.current)}
            >
              See all
            </Button>
          </div>
          {filteredProjects.length > 0 ? (
            <div className="new-tab-page__grid">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.title}
                  {...project}
                  onOpen={() => onOpenProject(project.title)}
                />
              ))}
            </div>
          ) : (
            <p className="new-tab-page__empty">No recent projects match your search.</p>
          )}
        </section>

        <section
          ref={makerWorldRef}
          className="new-tab-page__section new-tab-page__section--makerworld"
          aria-labelledby="new-tab-makerworld-title"
        >
          <div className="new-tab-page__section-header-row">
            <div className="new-tab-page__section-heading">
              <h2 id="new-tab-makerworld-title">From MakerWorld</h2>
              <p>Trending models for your printers.</p>
            </div>
            <Button
              color="base"
              leftIcon={false}
              rightIcon={<FigmaIcon name="chevron-right-small" size={20} />}
              onClick={() => revealSection(makerWorldRef.current)}
            >
              Browse
            </Button>
          </div>
          {filteredModels.length > 0 ? (
            <div className="new-tab-page__grid">
              {filteredModels.map((model) => (
                <ProductCard key={model.title} {...model} />
              ))}
            </div>
          ) : (
            <p className="new-tab-page__empty">No MakerWorld models match your search.</p>
          )}
        </section>
      </div>
    </main>
  );
}
