import type { ReactNode } from "react";

import type { ButtonColor, ButtonVariant } from "../Button/Button";
import type { StatusTone } from "../StatusIndicator/StatusIndicator";
import type { FigmaIconName } from "../../icons";

/**
 * Runtime context handed to every control renderer and custom section body.
 * Keeps toggle/select state in one place (SettingsPage) while the page config
 * stays pure data.
 */
export type RenderCtx = {
  getToggle: (id: string) => boolean;
  setToggle: (id: string, value: boolean) => void;
  getSelect: (id: string) => string;
  setSelect: (id: string, value: string) => void;
  getInput: (id: string) => string;
  setInput: (id: string, value: string) => void;
  assetUrl: (file: string) => string;
  /** Drill into a printer's detail page (Figma 9425:6663). */
  openPrinter: (id: string) => void;
};

export type SwitchControl = { kind: "switch"; id: string; initial: boolean };
export type SelectFieldControl = {
  kind: "select";
  id: string;
  initial: string;
  options: readonly string[];
};
export type ValueControl = { kind: "value"; text: string };
/** Read-only value + right chevron on a clickable drill-in row. */
export type DisclosureControl = { kind: "disclosure"; text: string };
/** Compact inline numeric input (Figma 9039:2837). */
export type NumberControl = { kind: "number"; id: string; initial: string };
export type LinkControl = {
  kind: "link";
  text: string;
  onClick?: (ctx: RenderCtx) => void;
};
export type StatusControl = { kind: "status"; label: string; tone?: StatusTone };
export type ButtonControl = {
  kind: "button";
  label: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  icon?: ReactNode;
  onClick?: (ctx: RenderCtx) => void;
};
/** Escape hatch for sections that aren't a simple row+control (preset/printer lists). */
export type NodeControl = { kind: "node"; render: (ctx: RenderCtx) => ReactNode };

export type RowControl =
  | SwitchControl
  | SelectFieldControl
  | ValueControl
  | DisclosureControl
  | NumberControl
  | LinkControl
  | StatusControl
  | ButtonControl
  | NodeControl;

export type RowConfig = {
  title: string;
  description?: string;
  control?: RowControl;
  /** Makes the whole row a button (drill-in rows). */
  onClick?: (ctx: RenderCtx) => void;
};

export type SectionConfig = {
  id: string;
  title: string;
  description: string;
  /** Trailing header action, e.g. an “Add printer” / “New preset” button. */
  action?: RowControl;
  /** Standard card of rows. Ignored when `body` is provided. */
  rows?: RowConfig[];
  /** Custom section body (preset lists, printer list). Takes precedence over `rows`. */
  body?: (ctx: RenderCtx) => ReactNode;
};

export type PageConfig = {
  /** Stable id; also the sidebar selection key. */
  id: string;
  /** Sidebar label. */
  label: string;
  /** Leading icon shown in the sidebar nav header. */
  icon: FigmaIconName;
  /** Page heading + subheading. */
  title: string;
  subtitle: string;
  /** Trailing header content next to the title (e.g. a printer status pill). */
  headerAside?: (ctx: RenderCtx) => ReactNode;
  sections: SectionConfig[];
};
