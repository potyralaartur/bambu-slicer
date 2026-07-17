import { useCallback, useEffect, useState } from "react";

import { FigmaIcon } from "../../icons";
import { Button } from "../Button/Button";
import { CompoundButton } from "../CompoundButton/CompoundButton";
import { IconButton } from "../IconButton/IconButton";
import { TooltipTrigger } from "../Tooltip/TooltipTrigger";
import { ToolFamily } from "./ToolFamily";
import type { ToolMenuTool } from "./ToolMenu";

import "./Toolbar.css";

/** Figma 8741:4983 — Toolbar. Tool families and shortcuts match the Tool Menu mocks. */
type ToolFamilyDef = {
  id: string;
  name: string;
  tools: ToolMenuTool[];
};

const TOOL_FAMILIES: ToolFamilyDef[] = [
  {
    id: "transform",
    name: "Transform",
    tools: [
      { id: "move", label: "Move", icon: "move", shortcut: "M" },
      { id: "rotate", label: "Rotate", icon: "rotate", shortcut: "R" },
      { id: "scale", label: "Scale", icon: "resize", shortcut: "S" },
      { id: "place-on-face", label: "Place on face", icon: "place-on-face", shortcut: "F" },
    ],
  },
  {
    id: "modify",
    name: "Modify",
    tools: [
      { id: "cut", label: "Cut", icon: "scissors", shortcut: "C" },
      { id: "split", label: "Split to parts", icon: "split", shortcut: "P" },
      { id: "boolean", label: "Mesh boolean", icon: "boolean", shortcut: "B" },
    ],
  },
  {
    id: "paint",
    name: "Paint",
    tools: [
      { id: "color-paint", label: "Color paint", icon: "paint", shortcut: "N" },
      { id: "support-paint", label: "Support paint", icon: "support", shortcut: "L" },
      { id: "seam-painting", label: "Seam painting", icon: "seam", shortcut: "K" },
      { id: "brim-ears", label: "Brim ears", icon: "brim", shortcut: "E" },
      { id: "fuzzy-skin", label: "Fuzzy skin", icon: "fuzzy", shortcut: "U" },
    ],
  },
  {
    id: "inspect",
    name: "Inspect",
    tools: [
      { id: "measure", label: "Measure", icon: "ruler", shortcut: "D" },
      { id: "assembly-view", label: "Assembly view", icon: "assembly", shortcut: "A" },
    ],
  },
];

const SHORTCUT_TO_TOOL = new Map(
  TOOL_FAMILIES.flatMap((family) =>
    family.tools.map((tool) => [tool.shortcut.toLowerCase(), tool.id] as const)
  )
);

function familyIdForTool(toolId: string): string | undefined {
  return TOOL_FAMILIES.find((f) => f.tools.some((t) => t.id === toolId))?.id;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable
  );
}

export function Toolbar() {
  const [activeToolId, setActiveToolId] = useState("move");
  // Last-picked tool per family, shown on the family button.
  const [currentByFamily, setCurrentByFamily] = useState<Record<string, string>>(
    () => Object.fromEntries(TOOL_FAMILIES.map((f) => [f.id, f.tools[0].id]))
  );
  const [openMenuFamilyId, setOpenMenuFamilyId] = useState<string | null>(null);

  const selectTool = useCallback((toolId: string) => {
    setActiveToolId(toolId);
    const familyId = familyIdForTool(toolId);
    if (familyId) {
      setCurrentByFamily((prev) => ({ ...prev, [familyId]: toolId }));
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      const toolId = SHORTCUT_TO_TOOL.get(e.key.toLowerCase());
      if (!toolId) return;
      e.preventDefault();
      selectTool(toolId);
      setOpenMenuFamilyId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectTool]);

  return (
    <div className="toolbar" role="toolbar" aria-label="Main toolbar">
      <div className="toolbar__group" role="group" aria-label="Plate actions">
        <TooltipTrigger label="Import model">
          <IconButton size="large" className="toolbar__icon-button" aria-label="Import model">
            <FigmaIcon name="plus" size={24} />
          </IconButton>
        </TooltipTrigger>
        <TooltipTrigger label="Add object">
          <IconButton size="large" className="toolbar__icon-button" aria-label="Add object">
            <FigmaIcon name="plus-square" size={24} />
          </IconButton>
        </TooltipTrigger>
        <TooltipTrigger label="Auto orient">
          <IconButton size="large" className="toolbar__icon-button" aria-label="Auto orient">
            <FigmaIcon name="auto" size={24} />
          </IconButton>
        </TooltipTrigger>
        <TooltipTrigger label="Arrange objects">
          <IconButton size="large" className="toolbar__icon-button" aria-label="Arrange objects">
            <FigmaIcon name="layout" size={24} />
          </IconButton>
        </TooltipTrigger>
        <TooltipTrigger label="Layer height">
          <IconButton size="large" className="toolbar__icon-button" aria-label="Layer height">
            <FigmaIcon name="layer-height" size={24} />
          </IconButton>
        </TooltipTrigger>
      </div>

      <div className="toolbar__divider" role="separator" aria-orientation="vertical" />

      <div className="toolbar__group" role="group" aria-label="Tools">
        {TOOL_FAMILIES.map((family) => (
          <ToolFamily
            key={family.id}
            id={family.id}
            name={family.name}
            tools={family.tools}
            currentToolId={currentByFamily[family.id]}
            activeToolId={activeToolId}
            menuOpen={openMenuFamilyId === family.id}
            onToggleMenu={() =>
              setOpenMenuFamilyId((prev) => (prev === family.id ? null : family.id))
            }
            onCloseMenu={() => setOpenMenuFamilyId(null)}
            onSelectTool={selectTool}
          />
        ))}
        <TooltipTrigger label="Text">
          <IconButton
            size="large"
            className="toolbar__icon-button"
            aria-label="Text"
            disabled
          >
            <FigmaIcon name="text" size={24} />
          </IconButton>
        </TooltipTrigger>
      </div>

      <div className="toolbar__divider" role="separator" aria-orientation="vertical" />

      <TooltipTrigger label="Assembly view">
        <IconButton
          size="large"
          className="toolbar__icon-button"
          aria-label="Assembly view"
          onClick={() => {}}
        >
          <FigmaIcon name="assembly" size={24} />
        </IconButton>
      </TooltipTrigger>

      <div className="toolbar__actions">
        <Button
          color="base"
          leftIcon={<FigmaIcon name="share-os" size={20} />}
          rightIcon={false}
        >
          Share
        </Button>
        <CompoundButton
          label="Slice"
          menuLabel="Slice options"
          onClick={() => {}}
          onMenuClick={() => {}}
        />
      </div>
    </div>
  );
}
