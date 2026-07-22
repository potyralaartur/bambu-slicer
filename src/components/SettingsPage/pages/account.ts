import type { PageConfig } from "../types";

/** Account page — Figma Settings Content variant 9339:6548. */
export const ACCOUNT_PAGE: PageConfig = {
  id: "account",
  label: "Account",
  icon: "people",
  title: "Account",
  subtitle: "Your Bambu Lab identity, sync, and privacy.",
  sections: [
    {
      id: "profile",
      title: "Profile",
      description: "Your Bambu Lab account identity and region.",
      rows: [
        {
          title: "Region",
          description: "Account region determines cloud servers and store.",
          control: {
            kind: "select",
            id: "region",
            initial: "North America",
            options: ["North America", "Europe", "Asia-Pacific", "China"],
          },
        },
        {
          title: "Email",
          control: { kind: "value", text: "potyralaartur@gmail.com" },
        },
        {
          title: "Log out",
          description: "Sign out of your Bambu Lab account on this device.",
          control: { kind: "button", label: "Log out", variant: "secondary", color: "danger" },
        },
      ],
    },
    {
      id: "cloud-sync",
      title: "Cloud Sync",
      description: "Keep presets across your devices.",
      rows: [
        {
          title: "Sync presets to cloud",
          description: "Printer, filament, and process profiles.",
          control: { kind: "switch", id: "syncPresets", initial: true },
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy & Data",
      description: "Control what leaves your machine.",
      rows: [
        {
          title: "Share anonymous usage data",
          control: { kind: "switch", id: "shareUsage", initial: false },
        },
        {
          title: "Remember logged-in accounts",
          description: "Auto-fill accounts on the sign-in screen.",
          control: { kind: "switch", id: "rememberAccounts", initial: true },
        },
      ],
    },
  ],
};
