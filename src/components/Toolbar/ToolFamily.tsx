import { useEffect, useRef } from "react";

import { FigmaIcon } from "../../icons";
import { IconButton } from "../IconButton/IconButton";
import { TooltipTrigger } from "../Tooltip/TooltipTrigger";
import { ToolMenu } from "./ToolMenu";
import type { ToolMenuTool } from "./ToolMenu";

/**
 * Figma 8732:4035 — Tool Family: large icon button (current tool of the family)
 * plus a Toolbar Chevron (Figma 8741:4745) that opens a Tool Menu dropdown.
 * Only tool families (with chevrons) participate in tool selection.
 */
export type ToolFamilyProps = {
  /** Family id, used for accessible labels and selection ownership. */
  id: string;
  /** Family name, used for accessible labels ("Transform tools" etc.). */
  name: string;
  tools: ToolMenuTool[];
  /** Tool shown on the family button (last picked from the menu). */
  currentToolId: string;
  /** Globally selected tool id. */
  activeToolId: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onSelectTool: (toolId: string) => void;
};

export function ToolFamily({
  name,
  tools,
  currentToolId,
  activeToolId,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onSelectTool,
}: ToolFamilyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLButtonElement>(null);
  const currentTool = tools.find((tool) => tool.id === currentToolId) ?? tools[0];
  const isActive = tools.some((tool) => tool.id === activeToolId);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) onCloseMenu();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseMenu();
        chevronRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, onCloseMenu]);

  return (
    <div ref={rootRef} className="tool-family">
      <TooltipTrigger label={currentTool.label}>
        <IconButton
          size="large"
          aria-label={currentTool.label}
          aria-pressed={isActive}
          className={[
            "tool-family__button",
            isActive ? "tool-family__button--active" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onSelectTool(currentTool.id)}
        >
          <FigmaIcon name={currentTool.icon} size={28} />
        </IconButton>
      </TooltipTrigger>
      <button
        ref={chevronRef}
        type="button"
        className={[
          "toolbar-chevron",
          menuOpen ? "toolbar-chevron--active" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label={`${name} tools`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={onToggleMenu}
      >
        <FigmaIcon
          name="chevron-down-small"
          size={20}
          className="toolbar-chevron__icon"
        />
      </button>
      {menuOpen && (
        <div className="tool-family__menu">
          <ToolMenu
            tools={tools}
            currentToolId={activeToolId}
            aria-label={`${name} tools`}
            onSelect={(toolId) => {
              onSelectTool(toolId);
              onCloseMenu();
            }}
            onClose={() => {
              onCloseMenu();
              chevronRef.current?.focus();
            }}
          />
        </div>
      )}
    </div>
  );
}
