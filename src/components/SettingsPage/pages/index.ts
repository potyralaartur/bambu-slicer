import type { PageConfig } from "../types";

import { ACCOUNT_PAGE } from "./account";
import { APP_PAGE } from "./app";
import { PRESETS_PAGE } from "./presets";
import { PRINTERS_PAGE } from "./printers";

/** Sidebar order = page order. Each entry is an independent, self-contained page. */
export const SETTINGS_PAGES: PageConfig[] = [
  ACCOUNT_PAGE,
  APP_PAGE,
  PRESETS_PAGE,
  PRINTERS_PAGE,
];
