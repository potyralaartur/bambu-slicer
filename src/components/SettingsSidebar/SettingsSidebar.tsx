import { FigmaIcon, type FigmaIconName } from "../../icons";
import { Button } from "../Button/Button";

import "./SettingsSidebar.css";

export type SettingsSidebarSection = { id: string; label: string };

export type SettingsSidebarPage = {
  id: string;
  label: string;
  icon: FigmaIconName;
  sections: SettingsSidebarSection[];
};

/** Drill-in mode (Figma 9425:6667): back button + flat section links. */
export type SettingsSidebarDetail = {
  backLabel: string;
  onBack: () => void;
  items: SettingsSidebarSection[];
  activeItemId: string;
  onSelectItem: (id: string) => void;
};

export type SettingsSidebarProps = {
  user: { name: string; email: string; avatarSrc: string };
  pages: SettingsSidebarPage[];
  activePageId: string;
  activeSectionId: string;
  onSelectPage: (id: string) => void;
  onSelectSection: (id: string) => void;
  /** When set, replaces the accordion nav with the drill-in back button + item list. */
  detail?: SettingsSidebarDetail;
};

/**
 * Figma 9286:5403 (Settings Sidebar) — account header + accordion nav.
 * Each page is a header (icon + label + chevron); the active page expands to a
 * connector-railed list of its sections, the current one shown as a filled pill.
 * With `detail`, renders the printer drill-in variant (Figma 9425:6667) instead.
 */
export function SettingsSidebar({
  user,
  pages,
  activePageId,
  activeSectionId,
  onSelectPage,
  onSelectSection,
  detail,
}: SettingsSidebarProps) {
  if (detail) {
    return (
      <nav className="settings-sidebar" aria-label="Settings">
        <div className="settings-sidebar__account">
          <img className="settings-sidebar__avatar" src={user.avatarSrc} alt="" aria-hidden="true" />
          <div className="settings-sidebar__identity">
            <p className="settings-sidebar__name">{user.name}</p>
            <p className="settings-sidebar__email">{user.email}</p>
          </div>
        </div>
        <Button
          variant="tertiary"
          color="base"
          leftIcon={<FigmaIcon name="chevron-left-small" size={20} />}
          rightIcon={false}
          className="settings-sidebar__back"
          onClick={detail.onBack}
        >
          {detail.backLabel}
        </Button>
        <div className="settings-sidebar__nav settings-sidebar__nav--detail">
          {detail.items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={[
                "settings-nav-item",
                item.id === detail.activeItemId ? "settings-nav-item--active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={item.id === detail.activeItemId ? "true" : undefined}
              onClick={() => detail.onSelectItem(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="settings-sidebar" aria-label="Settings">
      <div className="settings-sidebar__account">
        <img className="settings-sidebar__avatar" src={user.avatarSrc} alt="" aria-hidden="true" />
        <div className="settings-sidebar__identity">
          <p className="settings-sidebar__name">{user.name}</p>
          <p className="settings-sidebar__email">{user.email}</p>
        </div>
      </div>
      <div className="settings-sidebar__nav">
        {pages.map((page) => {
          const expanded = page.id === activePageId;
          return (
            <div key={page.id} className="settings-sidebar__group">
              <button
                type="button"
                className="settings-nav-header"
                aria-current={expanded ? "page" : undefined}
                aria-expanded={expanded}
                onClick={() => onSelectPage(page.id)}
              >
                <FigmaIcon name={page.icon} size={20} className="settings-nav-header__icon" />
                <span className="settings-nav-header__label">{page.label}</span>
                <FigmaIcon
                  name="chevron-right-small"
                  size={20}
                  className={[
                    "settings-nav-header__chevron",
                    expanded ? "settings-nav-header__chevron--open" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
              </button>
              {expanded ? (
                <div className="settings-nav-children">
                  <div className="settings-nav-children__rail" aria-hidden="true">
                    <span className="settings-nav-children__line" />
                  </div>
                  <div className="settings-nav-children__kids">
                    {page.sections.map((section) => (
                      <button
                        key={section.id}
                        type="button"
                        className={[
                          "settings-nav-item",
                          section.id === activeSectionId ? "settings-nav-item--active" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        aria-current={section.id === activeSectionId ? "true" : undefined}
                        onClick={() => onSelectSection(section.id)}
                      >
                        {section.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
