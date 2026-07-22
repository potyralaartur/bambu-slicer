import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { Button } from "../Button/Button";
import { SelectControl } from "../SelectControl/SelectControl";
import {
  SettingDisclosure,
  SettingLink,
  SettingNumberInput,
  SettingRow,
  SettingValue,
} from "../SettingRow/SettingRow";
import { SettingsCard } from "../SettingsCard/SettingsCard";
import { SettingsSection } from "../SettingsSection/SettingsSection";
import { SettingsSidebar } from "../SettingsSidebar/SettingsSidebar";
import { StatusIndicator } from "../StatusIndicator/StatusIndicator";
import { Switch } from "../Switch/Switch";

import { SETTINGS_PAGES } from "./pages";
import { PRINTER_DETAIL_PAGE } from "./pages/printer-detail";
import type { PageConfig, RenderCtx, RowControl } from "./types";

import "./SettingsPage.css";

const USER = {
  name: "Artur Potyrala",
  email: "potyralaartur@gmail.com",
  avatarSrc: `${import.meta.env.BASE_URL}assets/settings/avatar.svg`,
};

const ALL_PAGES: PageConfig[] = [...SETTINGS_PAGES, PRINTER_DETAIL_PAGE];

/** Seed toggle/select/input state from the controls declared across all pages. */
function collectInitialState() {
  const toggles: Record<string, boolean> = {};
  const selects: Record<string, string> = {};
  const inputs: Record<string, string> = {};
  for (const page of ALL_PAGES) {
    for (const section of page.sections) {
      for (const row of section.rows ?? []) {
        const control = row.control;
        if (control?.kind === "switch") toggles[control.id] = control.initial;
        else if (control?.kind === "select") selects[control.id] = control.initial;
        else if (control?.kind === "number") inputs[control.id] = control.initial;
      }
    }
  }
  return { toggles, selects, inputs };
}

function renderControl(control: RowControl, ctx: RenderCtx, ariaLabel: string): ReactNode {
  switch (control.kind) {
    case "switch":
      return (
        <Switch
          checked={ctx.getToggle(control.id)}
          onChange={(value) => ctx.setToggle(control.id, value)}
          aria-label={ariaLabel}
        />
      );
    case "select":
      return (
        <SelectControl
          value={ctx.getSelect(control.id)}
          options={control.options}
          onChange={(value) => ctx.setSelect(control.id, value)}
          aria-label={ariaLabel}
        />
      );
    case "value":
      return <SettingValue>{control.text}</SettingValue>;
    case "disclosure":
      return <SettingDisclosure>{control.text}</SettingDisclosure>;
    case "number":
      return (
        <SettingNumberInput
          value={ctx.getInput(control.id)}
          onChange={(value) => ctx.setInput(control.id, value)}
          incrementReference={control.initial}
          aria-label={ariaLabel}
        />
      );
    case "link":
      return (
        <SettingLink onClick={control.onClick ? () => control.onClick?.(ctx) : undefined}>
          {control.text}
        </SettingLink>
      );
    case "status":
      return <StatusIndicator label={control.label} tone={control.tone} />;
    case "button":
      return (
        <Button
          variant={control.variant}
          color={control.color}
          leftIcon={control.icon ?? false}
          rightIcon={false}
          onClick={control.onClick ? () => control.onClick?.(ctx) : undefined}
        >
          {control.label}
        </Button>
      );
    case "node":
      return control.render(ctx);
  }
}

/** Settings — four pages (Account / App / Presets / Printers) selected from the sidebar. */
export function SettingsPage() {
  const initialState = useMemo(collectInitialState, []);
  const [toggles, setToggles] = useState(initialState.toggles);
  const [selects, setSelects] = useState(initialState.selects);
  const [inputs, setInputs] = useState(initialState.inputs);
  const [activePageId, setActivePageId] = useState(SETTINGS_PAGES[0].id);
  const [printerOpen, setPrinterOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(
    SETTINGS_PAGES[0].sections[0]?.id ?? ""
  );
  const mainRef = useRef<HTMLDivElement | null>(null);
  // Ignore scroll-spy briefly after a programmatic jump / page switch.
  const suppressSpyUntil = useRef(0);

  const showPage = (page: PageConfig) => {
    setActiveSectionId(page.sections[0]?.id ?? "");
    suppressSpyUntil.current = performance.now() + 400;
    mainRef.current?.scrollTo({ top: 0 });
  };

  const ctx: RenderCtx = {
    getToggle: (id) => toggles[id] ?? false,
    setToggle: (id, value) => setToggles((current) => ({ ...current, [id]: value })),
    getSelect: (id) => selects[id] ?? "",
    setSelect: (id, value) => setSelects((current) => ({ ...current, [id]: value })),
    getInput: (id) => inputs[id] ?? "",
    setInput: (id, value) => setInputs((current) => ({ ...current, [id]: value })),
    assetUrl: (file) => `${import.meta.env.BASE_URL}assets/settings/${file}`,
    openPrinter: () => {
      setPrinterOpen(true);
      showPage(PRINTER_DETAIL_PAGE);
    },
  };

  const rootPage =
    SETTINGS_PAGES.find((page) => page.id === activePageId) ?? SETTINGS_PAGES[0];
  const activePage = printerOpen ? PRINTER_DETAIL_PAGE : rootPage;

  // Highlight the section whose top has passed a focus line that sweeps down as
  // scrolling nears the end, so trailing short sections still get a turn.
  const updateActiveFromScroll = useCallback(() => {
    const main = mainRef.current;
    if (!main || performance.now() < suppressSpyUntil.current) return;
    const maxScroll = main.scrollHeight - main.clientHeight;
    const progress = maxScroll > 0 ? main.scrollTop / maxScroll : 0;
    const focusY = main.scrollTop + progress * main.clientHeight;
    const mainTop = main.getBoundingClientRect().top;
    let current = activePage.sections[0]?.id ?? "";
    for (const section of activePage.sections) {
      const el = main.querySelector<HTMLElement>(`#${section.id}`);
      if (!el) continue;
      const top = el.getBoundingClientRect().top - mainTop + main.scrollTop;
      if (top <= focusY) current = section.id;
    }
    setActiveSectionId(current);
  }, [activePage]);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    main.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    return () => main.removeEventListener("scroll", updateActiveFromScroll);
  }, [updateActiveFromScroll]);

  const selectPage = (id: string) => {
    if (id === activePageId && !printerOpen) return;
    const page = SETTINGS_PAGES.find((p) => p.id === id) ?? SETTINGS_PAGES[0];
    setPrinterOpen(false);
    setActivePageId(id);
    showPage(page);
  };

  const closePrinter = () => {
    setPrinterOpen(false);
    showPage(rootPage);
  };

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    suppressSpyUntil.current = performance.now() + 1000;
    mainRef.current
      ?.querySelector<HTMLElement>(`#${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="settings-page">
      <SettingsSidebar
        user={USER}
        pages={SETTINGS_PAGES.map((page) => ({
          id: page.id,
          label: page.label,
          icon: page.icon,
          sections: page.sections.map((section) => ({ id: section.id, label: section.title })),
        }))}
        activePageId={rootPage.id}
        activeSectionId={activeSectionId}
        onSelectPage={selectPage}
        onSelectSection={scrollToSection}
        detail={
          printerOpen
            ? {
                backLabel: rootPage.label,
                onBack: closePrinter,
                items: activePage.sections.map((section) => ({
                  id: section.id,
                  label: section.title,
                })),
                activeItemId: activeSectionId,
                onSelectItem: scrollToSection,
              }
            : undefined
        }
      />
      <div className="settings-page__main" ref={mainRef}>
        <div className="settings-page__content">
          <div className="settings-page__header-row">
            <div className="settings-page__title-block">
              <h1 className="settings-page__title">{activePage.title}</h1>
              <p className="settings-page__subtitle">{activePage.subtitle}</p>
            </div>
            {activePage.headerAside?.(ctx)}
          </div>

          {activePage.sections.map((section) => (
            <SettingsSection
              key={section.id}
              id={section.id}
              title={section.title}
              description={section.description}
              action={
                section.action ? renderControl(section.action, ctx, section.title) : undefined
              }
            >
              {section.body ? (
                section.body(ctx)
              ) : (
                <SettingsCard>
                  {(section.rows ?? []).map((row) => (
                    <SettingRow
                      key={row.title}
                      title={row.title}
                      description={row.description}
                      control={
                        row.control ? renderControl(row.control, ctx, row.title) : undefined
                      }
                      onClick={row.onClick ? () => row.onClick?.(ctx) : undefined}
                    />
                  ))}
                </SettingsCard>
              )}
            </SettingsSection>
          ))}
        </div>
      </div>
    </div>
  );
}
