import type { PageConfig } from "../types";

/** App page — Figma Settings Content variant 9339:6687. */
export const APP_PAGE: PageConfig = {
  id: "app",
  label: "App",
  icon: "sliders-three",
  title: "App",
  subtitle: "Language, appearance, files, and advanced options.",
  sections: [
    {
      id: "general",
      title: "General",
      description: "Language, units, and startup.",
      rows: [
        {
          title: "Language",
          control: {
            kind: "select",
            id: "language",
            initial: "English",
            options: ["English", "Deutsch", "Español", "Français", "Polski", "日本語", "中文（简体）"],
          },
        },
        {
          title: "Units",
          control: {
            kind: "select",
            id: "units",
            initial: "Metric (mm)",
            options: ["Metric (mm)", "Imperial (in)"],
          },
        },
        {
          title: "Time format",
          control: {
            kind: "select",
            id: "timeFormat",
            initial: "24-hour",
            options: ["24-hour", "12-hour"],
          },
        },
        {
          title: "Remember last build plate",
          description: "Reopen with the plate type you used last.",
          control: { kind: "switch", id: "rememberPlate", initial: true },
        },
      ],
    },
    {
      id: "appearance",
      title: "Appearance & Input",
      description: "Theme and viewport controls.",
      rows: [
        {
          title: "Dark mode",
          control: { kind: "switch", id: "darkMode", initial: true },
        },
        {
          title: "Zoom to mouse position",
          description: "Zoom toward the cursor in the 3D viewport.",
          control: { kind: "switch", id: "zoomToMouse", initial: false },
        },
      ],
    },
    {
      id: "files",
      title: "Files & Projects",
      description: "Defaults for import, storage, and backups.",
      rows: [
        {
          title: "Download folder",
          control: { kind: "link", text: "~/Downloads/Bambu" },
        },
        {
          title: "Associate 3MF, STL, STEP files",
          control: { kind: "switch", id: "associateFiles", initial: true },
        },
        {
          title: "Auto-backup projects",
          description: "Save a recovery copy while you work.",
          control: {
            kind: "select",
            id: "autoBackup",
            initial: "Every 5 min",
            options: ["Off", "Every 1 min", "Every 5 min", "Every 10 min", "Every 30 min"],
          },
        },
      ],
    },
    {
      id: "network",
      title: "Network",
      description: "Connectivity and updates.",
      rows: [
        {
          title: "Network plugin",
          control: { kind: "value", text: "Installed" },
        },
        {
          title: "Receive beta updates",
          description: "Get pre-release builds before the general rollout.",
          control: { kind: "switch", id: "betaUpdates", initial: false },
        },
      ],
    },
    {
      id: "advanced",
      title: "Advanced",
      description: "Power-user and diagnostic options.",
      rows: [
        {
          title: "Interface mode",
          description: "Show simple, advanced, or developer parameters.",
          control: {
            kind: "select",
            id: "interfaceMode",
            initial: "Advanced",
            options: ["Simple", "Advanced", "Developer"],
          },
        },
        {
          title: "Auto-calculate flushing volumes",
          control: { kind: "switch", id: "autoFlush", initial: true },
        },
        {
          title: "Logs & diagnostics",
          control: { kind: "link", text: "Open folder" },
        },
      ],
    },
  ],
};
