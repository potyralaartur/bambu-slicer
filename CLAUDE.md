# Bambu Slicer

Dev server: `npm run dev` (Vite), served at `http://localhost:5173/bambu-slicer/` (or the next free port, e.g. 5174, if 5173 is taken — check with `lsof -i:5173`). The `/bambu-slicer/` path suffix is required; it comes from `base: "/bambu-slicer/"` in [vite.config.ts](vite.config.ts).

A `.claude/settings.json` SessionStart hook already starts this dev server automatically when a session begins in this project (skips if an instance is already running).

At the start of any session touching this project, open the Browser pane (`preview_start` with `{ url: "http://localhost:5173/bambu-slicer/" }`, or the actual port if different) without waiting to be asked — this project is UI work matched against a Figma design, so a visual check is almost always relevant.
