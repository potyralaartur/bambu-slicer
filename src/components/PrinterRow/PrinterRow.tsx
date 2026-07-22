import { FigmaIcon } from "../../icons";
import { StatusIndicator, type StatusTone } from "../StatusIndicator/StatusIndicator";

import "./PrinterRow.css";

export type PrinterRowProps = {
  name: string;
  details: string;
  image: string;
  thumbnailCrop?: "x1-carbon" | "a1-mini";
  status: { label: string; tone?: StatusTone };
  onClick?: () => void;
};

/** Figma 8920:1702 (Printer Row) — thumbnail, info, status, chevron. */
export function PrinterRow({
  name,
  details,
  image,
  thumbnailCrop,
  status,
  onClick,
}: PrinterRowProps) {
  const thumbnailClassName = [
    "printer-row__thumbnail",
    thumbnailCrop && `printer-row__thumbnail--${thumbnailCrop}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className="printer-row" onClick={onClick}>
      <span className={thumbnailClassName}>
        <span className="printer-row__thumbnail-crop">
          <img src={image} alt="" />
        </span>
      </span>
      <span className="printer-row__info">
        <span className="printer-row__name">{name}</span>
        <span className="printer-row__details">{details}</span>
      </span>
      <StatusIndicator label={status.label} tone={status.tone} />
      <FigmaIcon name="chevron-right-small" size={24} className="printer-row__chevron" />
    </button>
  );
}
