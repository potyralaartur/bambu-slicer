import { useState, type ReactNode } from "react";

import { CheckboxField } from "../CheckboxField/CheckboxField";
import { DropdownField } from "../DropdownField/DropdownField";
import { TextInputField } from "../TextInputField/TextInputField";

import "./ProcessTabPanel.css";

/**
 * Shared building blocks for the Process tab panels.
 *
 * Panels can be hand-written (Quality) or spec-driven (`SpecTabPanel`), where a
 * panel is described as sections of field specs mirroring Bambu Studio's
 * option groups (`Tab.cpp`) with labels/units/options/defaults from
 * `PrintConfig.cpp`. Field `id`s use Bambu Studio's config key names.
 */

/** Read access to the panel's current field state, for `visibleWhen` rules. */
export type PanelState = {
  value: (id: string) => string;
  checked: (id: string) => boolean;
};

type FieldBase = {
  /** Bambu Studio config key (e.g. `wall_loops`) — must be unique per panel. */
  id: string;
  label: string;
  /** Mirror of Studio's conditional visibility (e.g. Arachne-only fields). */
  visibleWhen?: (state: PanelState) => boolean;
};

export type FieldSpec =
  | (FieldBase & {
      kind: "text";
      defaultValue: string;
      /** Trailing suffix (e.g. `mm`); omit for unit-less fields. */
      unit?: string;
      inputMode?: "decimal" | "numeric";
    })
  | (FieldBase & { kind: "checkbox"; defaultChecked: boolean })
  | (FieldBase & {
      kind: "dropdown";
      defaultValue: string;
      options: readonly string[];
      showPattern?: boolean;
    });

export type SectionSpec = { title: string; fields: readonly FieldSpec[] };

export function TabPanelSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="process-tab-panel__section">
      <div className="process-tab-panel__subsection-header">
        <h3 className="process-tab-panel__subsection-title">{title}</h3>
      </div>
      <div className="process-tab-panel__fields">{children}</div>
    </div>
  );
}

export function SpecTabPanel({
  sections,
  className,
}: {
  sections: readonly SectionSpec[];
  className?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const section of sections) {
      for (const field of section.fields) {
        if (field.kind !== "checkbox") {
          initial[field.id] = field.defaultValue;
        }
      }
    }
    return initial;
  });
  const [checks, setChecks] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const section of sections) {
      for (const field of section.fields) {
        if (field.kind === "checkbox") {
          initial[field.id] = field.defaultChecked;
        }
      }
    }
    return initial;
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const state: PanelState = {
    value: (id) => values[id] ?? "",
    checked: (id) => checks[id] ?? false,
  };

  return (
    <div className={["process-tab-panel", className].filter(Boolean).join(" ")}>
      {sections.map((section) => (
        <TabPanelSection key={section.title} title={section.title}>
          {section.fields.map((field) => {
            if (field.visibleWhen && !field.visibleWhen(state)) {
              return null;
            }
            if (field.kind === "checkbox") {
              return (
                <CheckboxField
                  key={field.id}
                  label={field.label}
                  checked={state.checked(field.id)}
                  onChange={(e) =>
                    setChecks((cur) => ({ ...cur, [field.id]: e.target.checked }))
                  }
                />
              );
            }
            if (field.kind === "dropdown") {
              return (
                <DropdownField
                  key={field.id}
                  label={field.label}
                  value={state.value(field.id)}
                  options={field.options}
                  showPattern={field.showPattern}
                  onSelect={(option) => {
                    setValues((cur) => ({ ...cur, [field.id]: option }));
                    setOpenDropdown(null);
                  }}
                  active={openDropdown === field.id}
                  aria-expanded={openDropdown === field.id}
                  aria-haspopup="listbox"
                  onClick={() =>
                    setOpenDropdown((cur) => (cur === field.id ? null : field.id))
                  }
                />
              );
            }
            return (
              <TextInputField
                key={field.id}
                label={field.label}
                value={state.value(field.id)}
                onChange={(e) =>
                  setValues((cur) => ({ ...cur, [field.id]: e.target.value }))
                }
                unit={field.unit}
                showUnit={field.unit != null}
                inputMode={field.inputMode}
              />
            );
          })}
        </TabPanelSection>
      ))}
    </div>
  );
}
