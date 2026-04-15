import { useId, type InputHTMLAttributes } from "react";

import { Checkbox } from "../Checkbox/Checkbox";

import "./CheckboxField.css";

/**
 * Figma: **Checkbox Field** — label + checkbox, full-width row.
 *
 * Border / hover / focus behavior matches `DropdownField` and `TextInputField`:
 * resting transparent stroke, hover `Border/Base/Tertiary hover`, focused “active”
 * stroke `Content/Base/Secondary`. No row fill (transparent on the panel).
 *
 * @see https://www.figma.com/design/0H1HmDgMDUddD0yCXV0WJj/Bambu-Slicer?node-id=2488-1827
 *
 * Checkbox glyph: @see https://www.figma.com/design/0H1HmDgMDUddD0yCXV0WJj/Bambu-Slicer?node-id=2819-2764
 */
const FIGMA_CHECKBOX_FIELD = {
  fileKey: "0H1HmDgMDUddD0yCXV0WJj",
  nodeId: "2488:1827",
} as const;

export type CheckboxFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "className"
> & {
  label: string;
  className?: string;
};

export function CheckboxField({
  label,
  className = "",
  disabled = false,
  id: idProp,
  ...checkboxProps
}: CheckboxFieldProps) {
  const reactId = useId();
  const inputId = idProp ?? `checkbox-field-${reactId}`;

  const rootClass = ["checkbox-field", disabled ? "checkbox-field--disabled" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <label
      className={rootClass}
      htmlFor={inputId}
      data-figma-file-key={FIGMA_CHECKBOX_FIELD.fileKey}
      data-figma-node-id={FIGMA_CHECKBOX_FIELD.nodeId}
    >
      <span className="checkbox-field__label">
        <span className="checkbox-field__label-text">{label}</span>
      </span>
      <span className="checkbox-field__control">
        <Checkbox id={inputId} disabled={disabled} {...checkboxProps} />
      </span>
    </label>
  );
}
