import { useEffect, useRef } from "react";

import { FigmaIcon } from "../../icons";
import type { FigmaIconName } from "../../icons";

import "./ToolMenu.css";

/** Figma 8741:5814 — Tool Menu; items are Figma 8732:2497 — Tool Menu Item. */
export type ToolMenuTool = {
  id: string;
  label: string;
  icon: FigmaIconName;
  /** Single-key shortcut shown at the right edge of the menu item. */
  shortcut: string;
};

export type ToolMenuProps = {
  tools: ToolMenuTool[];
  /** Tool rendered in the green “Current” state. */
  currentToolId: string;
  onSelect: (toolId: string) => void;
  onClose: () => void;
  /** Accessible name of the menu, e.g. the tool family. */
  "aria-label": string;
};

export function ToolMenu({
  tools,
  currentToolId,
  onSelect,
  onClose,
  "aria-label": ariaLabel,
}: ToolMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = menuRef.current?.querySelectorAll<HTMLButtonElement>(
      ".tool-menu__item"
    );
    items?.[0]?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(".tool-menu__item") ?? []
    );
    const activeIndex = items.findIndex((item) => item === document.activeElement);

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const delta = e.key === "ArrowDown" ? 1 : -1;
      const next = (activeIndex + delta + items.length) % items.length;
      items[next]?.focus();
    } else if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
    }
  };

  return (
    <div
      ref={menuRef}
      className="tool-menu"
      role="menu"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
    >
      {tools.map((tool) => {
        const isCurrent = tool.id === currentToolId;
        return (
          <button
            key={tool.id}
            type="button"
            role="menuitemradio"
            aria-checked={isCurrent}
            className={[
              "tool-menu__item",
              isCurrent ? "tool-menu__item--current" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onSelect(tool.id)}
          >
            <FigmaIcon name={tool.icon} size={20} className="tool-menu__item-icon" />
            <span className="tool-menu__item-label">{tool.label}</span>
            <kbd className="tool-menu__item-shortcut">{tool.shortcut}</kbd>
          </button>
        );
      })}
    </div>
  );
}
