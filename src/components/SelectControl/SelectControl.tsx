import { useEffect, useRef, useState } from "react";

import { FigmaIcon } from "../../icons";

import "./SelectControl.css";

export type SelectControlProps = {
  value: string;
  /** Menu options; omit to render a static (non-interactive) pill. */
  options?: readonly string[];
  onChange?: (value: string) => void;
  "aria-label"?: string;
  disabled?: boolean;
};

type MenuPlacement = { top?: number; bottom?: number; right: number };

const MENU_MARGIN = 4;

/**
 * Figma 8940:2440 (Setting Row control, type=Select).
 * The expanded menu follows the Tool Menu panel design (Figma 8741:5814).
 * The menu is position:fixed so the card's overflow:hidden cannot clip it;
 * it closes on outside scroll instead of tracking the anchor.
 */
export function SelectControl({
  value,
  options,
  onChange,
  "aria-label": ariaLabel,
  disabled,
}: SelectControlProps) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<MenuPlacement>({ top: 0, right: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasMenu = !!options?.length;

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    const rect = buttonRef.current!.getBoundingClientRect();
    const estimatedHeight = (options?.length ?? 0) * 34 + 10;
    const right = window.innerWidth - rect.right;
    const overflowsBelow =
      rect.bottom + MENU_MARGIN + estimatedHeight > window.innerHeight - 8;
    const fitsAbove = rect.top - MENU_MARGIN - estimatedHeight > 8;
    setPlacement(
      overflowsBelow && fitsAbove
        ? { bottom: window.innerHeight - rect.top + MENU_MARGIN, right }
        : { top: rect.bottom + MENU_MARGIN, right }
    );
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    menuRef.current?.querySelector<HTMLButtonElement>(".select-control__option")?.focus();

    const close = () => setOpen(false);
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(".select-control__option") ?? []
    );
    const activeIndex = items.findIndex((item) => item === document.activeElement);
    const delta = e.key === "ArrowDown" ? 1 : -1;
    items[(activeIndex + delta + items.length) % items.length]?.focus();
  };

  const pick = (option: string) => {
    onChange?.(option);
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div ref={rootRef} className="select-control-root">
      <button
        ref={buttonRef}
        type="button"
        className={["select-control", open ? "select-control--open" : ""]
          .filter(Boolean)
          .join(" ")}
        aria-label={ariaLabel}
        aria-haspopup={hasMenu ? "listbox" : undefined}
        aria-expanded={hasMenu ? open : undefined}
        disabled={disabled}
        onClick={hasMenu ? toggle : undefined}
      >
        <span className="select-control__value">{value}</span>
        <FigmaIcon name="chevron-down-small" size={20} className="select-control__chevron" />
      </button>
      {open && hasMenu ? (
        <div
          ref={menuRef}
          className="select-control__menu"
          role="listbox"
          aria-label={ariaLabel}
          style={placement}
          onKeyDown={onMenuKeyDown}
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              className="select-control__option"
              onClick={() => pick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
