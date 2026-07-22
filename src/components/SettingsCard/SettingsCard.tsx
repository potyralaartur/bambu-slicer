import type { ReactNode } from "react";

import "./SettingsCard.css";

/** Figma 8920:3166 (Card) — bordered rounded container; children are rows. */
export function SettingsCard({ children }: { children: ReactNode }) {
  return <div className="settings-card">{children}</div>;
}
