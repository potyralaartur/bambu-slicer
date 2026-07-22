import type { ReactNode } from "react";

import "./SettingsSection.css";

export type SettingsSectionProps = {
  id: string;
  title: string;
  description: string;
  /** Optional trailing header action (e.g. “Add printer” button). */
  action?: ReactNode;
  children: ReactNode;
};

/** Figma 8919:1700 (Section Header) + section wrapper (`Sec: *` frames). */
export function SettingsSection({ id, title, description, action, children }: SettingsSectionProps) {
  return (
    <section id={id} className="settings-section" aria-label={title}>
      <div className="settings-section__header-row">
        <div className="settings-section__header">
          <h2 className="settings-section__title">{title}</h2>
          <p className="settings-section__description">{description}</p>
        </div>
        {action ? <div className="settings-section__action">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
