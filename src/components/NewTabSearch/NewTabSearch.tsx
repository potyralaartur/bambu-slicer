import { forwardRef } from "react";

import { NewTabIcon } from "../NewTabIcon/NewTabIcon";

import "./NewTabSearch.css";

export type NewTabSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

/** Figma 9219:4270 / 9219:4286 — resting, hover, and active search states. */
export const NewTabSearch = forwardRef<HTMLInputElement, NewTabSearchProps>(
  function NewTabSearch({ value, onChange }, ref) {
    return (
      <label className="new-tab-search">
        <NewTabIcon name="search" size={24} className="new-tab-search__icon" />
        <input
          ref={ref}
          className="new-tab-search__input"
          type="text"
          autoFocus
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search projects, printers, and MakerWorld models…"
          aria-label="Search projects, printers, and MakerWorld models"
        />
        <kbd className="new-tab-search__shortcut" aria-hidden>
          ⌘ K
        </kbd>
      </label>
    );
  },
);
