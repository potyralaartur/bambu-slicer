import { FigmaIcon } from "../../../icons";
import { PrinterRow, type PrinterRowProps } from "../../PrinterRow/PrinterRow";
import { SettingsCard } from "../../SettingsCard/SettingsCard";
import type { PageConfig, RenderCtx } from "../types";

/** `image` holds the asset filename here; resolved to a URL at render time. */
const PRINTERS: PrinterRowProps[] = [
  {
    name: "Bambu Lab P1S",
    details: "P1S · 0.4 mm nozzle · AMS · LAN",
    image: "printer-p1s.png",
    status: { label: "Printing · 62%" },
  },
  {
    name: "Bambu Lab X1 Carbon",
    details: "X1C · 0.4 mm nozzle · AMS ×2 · Cloud",
    image: "printer-x1c.png",
    thumbnailCrop: "x1-carbon",
    status: { label: "Online" },
  },
  {
    name: "Bambu Lab A1 Mini",
    details: "A1 Mini · 0.4 mm nozzle · Cloud",
    image: "printer-a1mini.png",
    thumbnailCrop: "a1-mini",
    status: { label: "Offline · 3 days ago", tone: "muted" },
  },
];

function PrinterList(ctx: RenderCtx) {
  return (
    <SettingsCard>
      {PRINTERS.map((printer, index) => (
        <PrinterRow
          key={printer.name}
          {...printer}
          image={ctx.assetUrl(printer.image)}
          // Only the P1S has a detail page (Figma 9425:6663) so far.
          onClick={index === 0 ? () => ctx.openPrinter("p1s") : undefined}
        />
      ))}
    </SettingsCard>
  );
}

/** Printers page — Figma Settings Content variant 9339:6965. */
export const PRINTERS_PAGE: PageConfig = {
  id: "printers",
  label: "Printers",
  icon: "printer",
  title: "Printers",
  subtitle: "Machines connected to Bambu Studio and shared defaults.",
  sections: [
    {
      id: "my-printers",
      title: "My Printers",
      description: "Add, connect, and manage your machines.",
      action: {
        kind: "button",
        label: "Add printer",
        variant: "tertiary",
        color: "brand",
        icon: <FigmaIcon name="plus" size={20} />,
      },
      body: (ctx) => PrinterList(ctx),
    },
    {
      id: "global",
      title: "Global Settings",
      description: "Connection and device defaults shared across all printers.",
      rows: [
        {
          title: "Keep liveview when printing",
          description: "Keep the camera stream open during prints.",
          control: { kind: "switch", id: "keepLiveview", initial: true },
        },
        {
          title: "Send to multiple devices",
          description: "Show the multi-device queue when sending a sliced plate.",
          control: { kind: "switch", id: "multiDevices", initial: false },
        },
        {
          title: "Default connection mode",
          description: "Applied to newly added printers. Can be changed per printer.",
          control: {
            kind: "select",
            id: "globalConnectionMode",
            initial: "LAN only",
            options: ["LAN only", "Cloud"],
          },
        },
      ],
    },
  ],
};
