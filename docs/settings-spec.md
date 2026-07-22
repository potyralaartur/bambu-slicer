# Bambu Slicer — Settings spec

Single source of truth for the settings buildout. Every implementation step reads
**this file**, not Figma — that is what keeps agent context small.

Derived from the corrected Figma design (revised 2026-07-21) + current `src/` code.
Figma file `0H1HmDgMDUddD0yCXV0WJj`. Confidence column: **M** = from design memory/audit
(high but worth a Figma spot-check), **C** = matches current code, **?** = needs a Figma read
before building.

---

## 0. Structural decision (read first)

The **code today** is one scrolling `SettingsPage.tsx`: a sidebar with grouped nav
items that *scroll* to sections within a single long page.

The **corrected Figma** is a variant set `Settings Content 9341:7022` with
`Master = Account | App | Presets | Printers` — i.e. the sidebar *switches between four
separate pages*, and **Presets is now a top-level page** (it was not in the code).

**Recommendation:** move the code to page-switching (sidebar selects one of four pages)
to match the design. This also makes each page an independent unit a subagent can own
without touching the others. The scroll-spy logic in `SettingsPage.tsx` gets replaced by
a `activePage` selector.

Two editor modals (Filament, Printer) are separate surfaces reached from the Presets /
Printers pages, not part of the four-page set.

---

## 1. Account page  — Figma variant 9339:6548  (confidence: M)

Placeholder identity in Figma = "Mira Kovalchuk"; code uses "Artur Potyrala". Keep code's.

| Section | Row | Control | Notes |
|---|---|---|---|
| Profile | Region | Dropdown | NA / Europe / Asia-Pacific / China |
| Profile | Email | Value (read-only) | account email |
| Profile | **Log out** | **Danger button** ("Log out") | desc: "Sign out of your Bambu Lab account on this device." Figma Button Secondary/Danger 9044:2669 |
| Cloud Sync | Sync presets to cloud | Switch | single row (was two in code) |
| Privacy & Data | Share anonymous usage data | Switch | |
| Privacy & Data | Remember logged-in accounts | Switch (ON) | auto-fill accounts |

**Removed vs current code:** Sync print history, Default connection mode, Allow camera
streaming over cloud, and the **entire Integrations section** (MakerWorld / Bambu Handy /
Third-party access). `?` — confirm whether "Third-party app access" survives anywhere.

---

## 2. App page  — Figma variant 9339:6687  (confidence: M)

Sections: **General / Appearance & Input / Files & Projects / Network / Advanced**
(Notifications section deleted entirely).

| Section | Row | Control | Notes |
|---|---|---|---|
| General | Language | Dropdown | |
| General | Units | Dropdown | Metric / Imperial |
| General | Time format | Dropdown | 24-hour (was "Open last project") |
| General | Remember last build plate | Switch | = auto plate type (moved here from Presets) |
| Appearance & Input | Dark mode | Switch (ON) | (was Theme dropdown) |
| Appearance & Input | Zoom to mouse position | Switch (OFF) | (was Camera navigation dropdown) |
| Files & Projects | Download folder | Link | |
| Files & Projects | Associate 3MF/STL/STEP files | Switch | combined (Studio has 3 checkboxes — kept as one) |
| Files & Projects | Auto-backup projects | Dropdown | |
| Network | Network plugin | Value ("Installed") | |
| Network | Receive beta updates | Switch (OFF) | (was Update channel dropdown) |
| Advanced | Interface mode | Dropdown | Simple / Advanced / Developer |
| Advanced | Auto-calculate flushing volumes | Switch | |
| Advanced | Logs & diagnostics | Link ("Open folder") | |

**Deleted vs code:** Notifications section (all 3 rows), Invert zoom, Proxy,
"Enable send to multiple printers" (multi-device lives on Printers page only).

---

## 3. Presets page  — Figma variant 9339:6826  (confidence: M)  ← NEW, not in code

List + modal pattern. Each preset list = Section Header + tertiary "New preset" button +
Card of preset rows; row control = Preset Action (edit / duplicate / delete).

| Section | Content |
|---|---|
| Filament | Card of ~5 filament preset rows + "New preset" |
| Process | Card of ~5 process preset rows + "New preset" |
| **Behavior** | Auto-transfer modified values (Switch ON) · Check for preset updates (Switch ON) |

**Edit Preset modal** — Figma 9347:5956 (560w). Opened by a preset row's edit action.
For filament/printer presets this is the *tabbed editor* (sections 6 & 7); a simple modal
uses Form Field + Input.

---

## 4. Printers page  — Figma variant 9339:6965  (confidence: M/C)

| Section | Row | Control | Notes |
|---|---|---|---|
| My Printers | (list of printer rows) | PrinterRow + "Add printer" action | matches code |
| Global Settings | Keep liveview when printing | Switch | (was "Auto-connect on launch") |
| Global Settings | Send to multiple devices | Switch | kept |
| Global Settings | Default connection mode | Dropdown | for newly added printers |

**Removed vs code:** Default connection mode as a *privacy* row; auto-connect row renamed.

### 4a. Printer Settings subpage — Figma **Printer Settings Content 9441:7755** → screen 9425:6663 (confidence: M)

Per-printer device settings (opened from a printer). Canonical surface is 9441:7755;
the older 9249:5552 / 9254:4022 is dead — ignore it.

| Section | Row | Control |
|---|---|---|
| Device | Connection mode | Dropdown (kept as redesign) |
| Device | Camera & timelapse | (kept as redesign) |
| Manage | Reset to factory profile | (existing) |
| Manage | **Remove printer** | **Danger button** ("Remove") — desc "Permanently remove this printer from Bambu Studio." |

---

## 5. Filament Editor modal — Figma Content set 9400:6658  (confidence: M)

Tabbed editor. Left Tab Rail (6 items, one active) + Params panel. `TabList` + field
components already exist in code (`ProcessSection` uses the same tab pattern).

| Tab | Fields (real Bambu filament settings) |
|---|---|
| Filament | type, diameter, flow ratio, density, nozzle temps, bed temps, max volumetric speed, pressure advance |
| Cooling | fan speed, overhang thresholds, min layer time |
| Overrides | retraction length, wipe |
| Advanced | filament start G-code + end G-code (Code Block) |
| Multimaterial | flushing volumes, filament change |
| Notes | free-text area |

---

## 6. Printer Editor modal — Figma frame 9447:6541  (confidence: M)

Tabbed editor cloned from the Filament one. 4 tabs. Only the **Machine** tab content is
authored in Figma so far — Limits / G-code / Notes are stubs.

| Tab | Fields |
|---|---|
| Machine | Printable space (height, extruder clearance radius/height, height to rod, height to lid), Nozzle (diameter 0.4mm, type Hardened steel, volume mm³), Extruder & retraction (retraction length, z-hop, retraction speed, wipe-while-retracting checkbox) |
| Limits | *(not yet designed — stub)* |
| G-code | *(not yet designed — stub)* |
| Notes | free-text |

---

## Component mapping (code already has these — reuse, don't rebuild)

| Spec control | Code component |
|---|---|
| Switch | `Switch` |
| Dropdown | `SelectControl` / `DropdownField` |
| Value (read-only) | `SettingValue` |
| Link | `SettingLink` |
| Danger button | `Button` (needs a danger/destructive variant — check `Button.css`) |
| Row wrapper | `SettingRow` in `SettingsCard` in `SettingsSection` |
| Text/number field | `TextInputField` |
| Checkbox | `CheckboxField` |
| Tabbed editor | `TabList` + `Tab` + panel components (see `ProcessSection`) |

**Open item:** current `Button` may not have a danger variant — the Figma uses
Button Secondary/Danger 9044:2669. Verify `Button.tsx`/`Button.css` before the Log out /
Remove printer rows.
