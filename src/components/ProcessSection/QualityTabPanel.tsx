import { useState, type ReactNode } from "react";

import { CheckboxField } from "../CheckboxField/CheckboxField";
import { DropdownField } from "../DropdownField/DropdownField";
import { TextInputField } from "../TextInputField/TextInputField";

import "./QualityTabPanel.css";

/**
 * Figma: **Quality panel** — tab content for Process → Quality.
 *
 * @see https://www.figma.com/design/0H1HmDgMDUddD0yCXV0WJj/Bambu-Slicer?node-id=36-702
 */
const FIGMA_QUALITY_PANEL = {
  fileKey: "0H1HmDgMDUddD0yCXV0WJj",
  nodeId: "36:702",
} as const;

type DropdownKey =
  | "seamPosition"
  | "ironingType"
  | "ironingPattern"
  | "wallGeneratorType"
  | "orderOfWalls"
  | "onlyOneWallTop";

function QualitySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="quality-tab-panel__section">
      <div className="quality-tab-panel__subsection-header">
        <h3 className="quality-tab-panel__subsection-title">{title}</h3>
      </div>
      <div className="quality-tab-panel__fields">{children}</div>
    </div>
  );
}

export function QualityTabPanel() {
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const toggleDropdown = (key: DropdownKey) => {
    setOpenDropdown((cur) => (cur === key ? null : key));
  };

  const [layerHeight, setLayerHeight] = useState("0.16");
  const [initialLayerHeight, setInitialLayerHeight] = useState("0.2");

  const [lineWidthDefault, setLineWidthDefault] = useState("0.42");
  const [lineWidthInitialLayer, setLineWidthInitialLayer] = useState("0.5");
  const [outerWall, setOuterWall] = useState("0.42");
  const [innerWall, setInnerWall] = useState("0.45");
  const [topSurface, setTopSurface] = useState("0.42");
  const [sparseInfill, setSparseInfill] = useState("0.45");
  const [internalSolidInfill, setInternalSolidInfill] = useState("0.42");
  const [supportLineWidth, setSupportLineWidth] = useState("0.42");

  const [seamPosition] = useState("Aligned");
  const [awayFromOverhangs, setAwayFromOverhangs] = useState(false);
  const [smartScarfApplication, setSmartScarfApplication] = useState(true);
  const [scarfAngleThreshold, setScarfAngleThreshold] = useState("155");
  const [scarfAroundEntireWall, setScarfAroundEntireWall] = useState(false);
  const [scarfSteps, setScarfSteps] = useState("10");
  const [smartScarfApplication2, setSmartScarfApplication2] = useState(true);
  const [scarfJointInnerWalls, setScarfJointInnerWalls] = useState(false);
  const [overrideFilamentScarf, setOverrideFilamentScarf] = useState(true);

  const [sliceGapClosingRadius, setSliceGapClosingRadius] = useState("0.049");
  const [resolution, setResolution] = useState("0.012");
  const [arcFitting, setArcFitting] = useState(true);
  const [xyHoleCompensation, setXyHoleCompensation] = useState("0.42");
  const [xyContourCompensation, setXyContourCompensation] = useState("0");
  const [autoCircleContourHole, setAutoCircleContourHole] = useState(false);
  const [elephantFootCompensation, setElephantFootCompensation] = useState("0.15");
  const [preciseZHeight, setPreciseZHeight] = useState(false);

  const [ironingType] = useState("Top surfaces");
  const [ironingPattern] = useState("Rectilinear");
  const [ironingSpeed, setIroningSpeed] = useState("30");
  const [ironingFlow, setIroningFlow] = useState("10");
  const [ironingLineSpacing, setIroningLineSpacing] = useState("0.15");
  const [ironingInset, setIroningInset] = useState("0.21");

  const [wallGeneratorType] = useState("Classic");

  const [orderOfWalls] = useState("Inner/Outer");
  const [printInfillFirst, setPrintInfillFirst] = useState(false);
  const [bridgeFlow, setBridgeFlow] = useState("1");
  const [thickBridges, setThickBridges] = useState(false);
  const [onlyOneWallTop] = useState("Top surfaces");
  const [onlyOneWallFirstLayer, setOnlyOneWallFirstLayer] = useState(false);
  const [smoothSpeedDiscontinuity, setSmoothSpeedDiscontinuity] = useState(true);
  const [smoothCoefficient, setSmoothCoefficient] = useState("150");
  const [avoidCrossingWall, setAvoidCrossingWall] = useState(false);
  const [smoothingWallSpeedAlongZ, setSmoothingWallSpeedAlongZ] = useState(false);

  return (
    <div
      className="quality-tab-panel"
      data-figma-file-key={FIGMA_QUALITY_PANEL.fileKey}
      data-figma-node-id={FIGMA_QUALITY_PANEL.nodeId}
    >
      <QualitySection title="Layer height">
        <TextInputField
          label="Layer height"
          value={layerHeight}
          onChange={(e) => setLayerHeight(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <TextInputField
          label="Initial layer height"
          value={initialLayerHeight}
          onChange={(e) => setInitialLayerHeight(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
      </QualitySection>

      <QualitySection title="Line width">
        <TextInputField
          label="Default"
          value={lineWidthDefault}
          onChange={(e) => setLineWidthDefault(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <TextInputField
          label="Initial layer"
          value={lineWidthInitialLayer}
          onChange={(e) => setLineWidthInitialLayer(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <TextInputField
          label="Outer wall"
          value={outerWall}
          onChange={(e) => setOuterWall(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <TextInputField
          label="Inner wall"
          value={innerWall}
          onChange={(e) => setInnerWall(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <TextInputField
          label="Top surface"
          value={topSurface}
          onChange={(e) => setTopSurface(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <TextInputField
          label="Sparse infill"
          value={sparseInfill}
          onChange={(e) => setSparseInfill(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <TextInputField
          label="Internal solid infill"
          value={internalSolidInfill}
          onChange={(e) => setInternalSolidInfill(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <TextInputField
          label="Support"
          value={supportLineWidth}
          onChange={(e) => setSupportLineWidth(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
      </QualitySection>

      <QualitySection title="Seam">
        <DropdownField
          label="Position"
          value={seamPosition}
          active={openDropdown === "seamPosition"}
          aria-expanded={openDropdown === "seamPosition"}
          aria-haspopup="listbox"
          onClick={() => toggleDropdown("seamPosition")}
        />
        <CheckboxField
          label="Away from overhangs"
          checked={awayFromOverhangs}
          onChange={(e) => setAwayFromOverhangs(e.target.checked)}
        />
        <CheckboxField
          label="Smart scarf application"
          checked={smartScarfApplication}
          onChange={(e) => setSmartScarfApplication(e.target.checked)}
        />
        <TextInputField
          label="Scarf appl. angle threshold"
          value={scarfAngleThreshold}
          onChange={(e) => setScarfAngleThreshold(e.target.value)}
          unit="°"
          inputMode="decimal"
        />
        <CheckboxField
          label="Scarf around entire wall"
          checked={scarfAroundEntireWall}
          onChange={(e) => setScarfAroundEntireWall(e.target.checked)}
        />
        <TextInputField
          label="Scarf steps"
          value={scarfSteps}
          onChange={(e) => setScarfSteps(e.target.value)}
          showUnit={false}
          inputMode="numeric"
        />
        <CheckboxField
          label="Smart scarf application"
          checked={smartScarfApplication2}
          onChange={(e) => setSmartScarfApplication2(e.target.checked)}
        />
        <CheckboxField
          label="Scarf joint for inner walls"
          checked={scarfJointInnerWalls}
          onChange={(e) => setScarfJointInnerWalls(e.target.checked)}
        />
        <CheckboxField
          label="Override filament scarf seam setting"
          checked={overrideFilamentScarf}
          onChange={(e) => setOverrideFilamentScarf(e.target.checked)}
        />
      </QualitySection>

      <QualitySection title="Precision">
        <TextInputField
          label="Slice gap closing radius"
          value={sliceGapClosingRadius}
          onChange={(e) => setSliceGapClosingRadius(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <TextInputField
          label="Resolution"
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <CheckboxField
          label="Arc fitting"
          checked={arcFitting}
          onChange={(e) => setArcFitting(e.target.checked)}
        />
        <TextInputField
          label="X-Y hole compensation"
          value={xyHoleCompensation}
          onChange={(e) => setXyHoleCompensation(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <TextInputField
          label="X-Y contour compensation"
          value={xyContourCompensation}
          onChange={(e) => setXyContourCompensation(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <CheckboxField
          label="Auto circle contour-hole compensation"
          checked={autoCircleContourHole}
          onChange={(e) => setAutoCircleContourHole(e.target.checked)}
        />
        <TextInputField
          label="Elephant foot compensation"
          value={elephantFootCompensation}
          onChange={(e) => setElephantFootCompensation(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <CheckboxField
          label="Precise Z height"
          checked={preciseZHeight}
          onChange={(e) => setPreciseZHeight(e.target.checked)}
        />
      </QualitySection>

      <QualitySection title="Ironing">
        <DropdownField
          label="Type"
          value={ironingType}
          active={openDropdown === "ironingType"}
          aria-expanded={openDropdown === "ironingType"}
          aria-haspopup="listbox"
          onClick={() => toggleDropdown("ironingType")}
        />
        <DropdownField
          label="Pattern"
          value={ironingPattern}
          showPattern
          active={openDropdown === "ironingPattern"}
          aria-expanded={openDropdown === "ironingPattern"}
          aria-haspopup="listbox"
          onClick={() => toggleDropdown("ironingPattern")}
        />
        <TextInputField
          label="Speed"
          value={ironingSpeed}
          onChange={(e) => setIroningSpeed(e.target.value)}
          unit="mm/s"
          inputMode="decimal"
        />
        <TextInputField
          label="Flow"
          value={ironingFlow}
          onChange={(e) => setIroningFlow(e.target.value)}
          unit="%"
          inputMode="decimal"
        />
        <TextInputField
          label="Line spacing"
          value={ironingLineSpacing}
          onChange={(e) => setIroningLineSpacing(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <TextInputField
          label="Inset"
          value={ironingInset}
          onChange={(e) => setIroningInset(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
      </QualitySection>

      <QualitySection title="Wall generator">
        <DropdownField
          label="Type"
          value={wallGeneratorType}
          active={openDropdown === "wallGeneratorType"}
          aria-expanded={openDropdown === "wallGeneratorType"}
          aria-haspopup="listbox"
          onClick={() => toggleDropdown("wallGeneratorType")}
        />
      </QualitySection>

      <QualitySection title="Advanced">
        <DropdownField
          label="Order of walls"
          value={orderOfWalls}
          active={openDropdown === "orderOfWalls"}
          aria-expanded={openDropdown === "orderOfWalls"}
          aria-haspopup="listbox"
          onClick={() => toggleDropdown("orderOfWalls")}
        />
        <CheckboxField
          label="Print infill first"
          checked={printInfillFirst}
          onChange={(e) => setPrintInfillFirst(e.target.checked)}
        />
        <TextInputField
          label="Bridge flow"
          value={bridgeFlow}
          onChange={(e) => setBridgeFlow(e.target.value)}
          showUnit={false}
          inputMode="decimal"
        />
        <CheckboxField
          label="Thick bridges"
          checked={thickBridges}
          onChange={(e) => setThickBridges(e.target.checked)}
        />
        <DropdownField
          label="Only one wall on top surfaces"
          value={onlyOneWallTop}
          active={openDropdown === "onlyOneWallTop"}
          aria-expanded={openDropdown === "onlyOneWallTop"}
          aria-haspopup="listbox"
          onClick={() => toggleDropdown("onlyOneWallTop")}
        />
        <CheckboxField
          label="Only one wall on first layer"
          checked={onlyOneWallFirstLayer}
          onChange={(e) => setOnlyOneWallFirstLayer(e.target.checked)}
        />
        <CheckboxField
          label="Smooth speed discontinuity area"
          checked={smoothSpeedDiscontinuity}
          onChange={(e) => setSmoothSpeedDiscontinuity(e.target.checked)}
        />
        <TextInputField
          label="Smooth coefficient"
          value={smoothCoefficient}
          onChange={(e) => setSmoothCoefficient(e.target.value)}
          showUnit={false}
          inputMode="numeric"
        />
        <CheckboxField
          label="Avoid crossing wall"
          checked={avoidCrossingWall}
          onChange={(e) => setAvoidCrossingWall(e.target.checked)}
        />
        <CheckboxField
          label="Smoothing wall speed along Z"
          checked={smoothingWallSpeedAlongZ}
          onChange={(e) => setSmoothingWallSpeedAlongZ(e.target.checked)}
        />
      </QualitySection>
    </div>
  );
}
