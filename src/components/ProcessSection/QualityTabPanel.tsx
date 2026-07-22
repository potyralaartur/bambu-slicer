import { useState } from "react";

import { CheckboxField } from "../CheckboxField/CheckboxField";
import { DropdownField } from "../DropdownField/DropdownField";
import { TextInputField } from "../TextInputField/TextInputField";

import { TabPanelSection } from "./ProcessTabPanel";

/**
 * Figma: **Quality panel** — tab content for Process → Quality.
 *
 * Field inventory, labels, options and values mirror Bambu Studio's
 * Quality page (`Tab.cpp` → `add_options_page(L("Quality"))`, defaults from
 * `PrintConfig.cpp`), with numeric values matching the "0.20 mm Standard" preset.
 *
 * @see https://www.figma.com/design/0H1HmDgMDUddD0yCXV0WJj/Bambu-Slicer?node-id=36-702
 */
const FIGMA_QUALITY_PANEL = {
  fileKey: "0H1HmDgMDUddD0yCXV0WJj",
  nodeId: "36:702",
} as const;

type DropdownKey =
  | "seamPosition"
  | "scarfSeamType"
  | "ironingType"
  | "ironingPattern"
  | "wallGeneratorType"
  | "orderOfWalls"
  | "counterboreHoleBridging"
  | "onlyOneWallTop";

const SEAM_POSITION_OPTIONS = ["Nearest", "Aligned", "Back", "Random"] as const;
const SCARF_SEAM_TYPE_OPTIONS = ["None", "Contour", "Contour and hole"] as const;
const IRONING_TYPE_OPTIONS = [
  "No ironing",
  "Top surfaces",
  "Topmost surface",
  "All solid layer",
] as const;
const IRONING_PATTERN_OPTIONS = ["Concentric", "Rectilinear"] as const;
const WALL_GENERATOR_OPTIONS = ["Classic", "Arachne"] as const;
const ORDER_OF_WALLS_OPTIONS = [
  "Inner/Outer",
  "Outer/Inner",
  "Inner Wall/Outer Wall/Inner Wall",
] as const;
const COUNTERBORE_HOLE_BRIDGING_OPTIONS = [
  "None",
  "Partially bridged",
  "Sacrificial layer",
] as const;
const ONLY_ONE_WALL_TOP_OPTIONS = [
  "Not apply",
  "Top surfaces",
  "Topmost surface",
] as const;

export function QualityTabPanel() {
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const toggleDropdown = (key: DropdownKey) => {
    setOpenDropdown((cur) => (cur === key ? null : key));
  };

  const [layerHeight, setLayerHeight] = useState("0.2");
  const [initialLayerHeight, setInitialLayerHeight] = useState("0.2");
  const [mixedColorSublayer, setMixedColorSublayer] = useState(false);

  const [lineWidthDefault, setLineWidthDefault] = useState("0.42");
  const [lineWidthInitialLayer, setLineWidthInitialLayer] = useState("0.5");
  const [outerWall, setOuterWall] = useState("0.42");
  const [innerWall, setInnerWall] = useState("0.45");
  const [topSurface, setTopSurface] = useState("0.42");
  const [sparseInfill, setSparseInfill] = useState("0.45");
  const [internalSolidInfill, setInternalSolidInfill] = useState("0.42");
  const [supportLineWidth, setSupportLineWidth] = useState("0.42");

  const [seamPosition, setSeamPosition] = useState("Aligned");
  const [awayFromOverhangs, setAwayFromOverhangs] = useState(false);
  const [seamGap, setSeamGap] = useState("15");
  const [smartScarfApplication, setSmartScarfApplication] = useState(true);
  const [scarfAngleThreshold, setScarfAngleThreshold] = useState("155");
  const [scarfAroundEntireWall, setScarfAroundEntireWall] = useState(false);
  const [scarfSteps, setScarfSteps] = useState("10");
  const [scarfJointInnerWalls, setScarfJointInnerWalls] = useState(true);
  const [overrideFilamentScarf, setOverrideFilamentScarf] = useState(false);
  const [scarfSeamType, setScarfSeamType] = useState("None");
  const [scarfStartHeight, setScarfStartHeight] = useState("10");
  const [scarfSlopeGap, setScarfSlopeGap] = useState("0");
  const [scarfLength, setScarfLength] = useState("10");
  const [wipeSpeed, setWipeSpeed] = useState("80");
  const [roleBaseWipeSpeed, setRoleBaseWipeSpeed] = useState(true);

  const [sliceGapClosingRadius, setSliceGapClosingRadius] = useState("0.049");
  const [resolution, setResolution] = useState("0.012");
  const [arcFitting, setArcFitting] = useState(true);
  const [xyHoleCompensation, setXyHoleCompensation] = useState("0");
  const [xyContourCompensation, setXyContourCompensation] = useState("0");
  const [autoCircleContourHole, setAutoCircleContourHole] = useState(false);
  const [circleCompensationOffset, setCircleCompensationOffset] = useState("0");
  const [elephantFootCompensation, setElephantFootCompensation] = useState("0.15");
  const [preciseWall, setPreciseWall] = useState(false);
  const [preciseZHeight, setPreciseZHeight] = useState(false);

  const [ironingType, setIroningType] = useState("No ironing");
  const [ironingPattern, setIroningPattern] = useState("Rectilinear");
  const [ironingSpeed, setIroningSpeed] = useState("30");
  const [ironingFlow, setIroningFlow] = useState("10");
  const [ironingLineSpacing, setIroningLineSpacing] = useState("0.15");
  const [ironingInset, setIroningInset] = useState("0.21");
  const [ironingDirection, setIroningDirection] = useState("45");

  const [wallGeneratorType, setWallGeneratorType] = useState("Arachne");
  const [wallTransitionAngle, setWallTransitionAngle] = useState("10");
  const [wallTransitionFilterMargin, setWallTransitionFilterMargin] = useState("25");
  const [wallTransitionLength, setWallTransitionLength] = useState("100");
  const [wallDistributionCount, setWallDistributionCount] = useState("1");
  const [minWallWidth, setMinWallWidth] = useState("85");
  const [minFeatureSize, setMinFeatureSize] = useState("25");

  const [orderOfWalls, setOrderOfWalls] = useState("Inner/Outer");
  const [printInfillFirst, setPrintInfillFirst] = useState(false);
  const [bridgeFlow, setBridgeFlow] = useState("1");
  const [thickBridges, setThickBridges] = useState(false);
  const [counterboreHoleBridging, setCounterboreHoleBridging] = useState("None");
  const [objectFlowRatio, setObjectFlowRatio] = useState("1");
  const [topSurfaceFlowRatio, setTopSurfaceFlowRatio] = useState("1");
  const [initialLayerFlowRatio, setInitialLayerFlowRatio] = useState("1");
  const [onlyOneWallTop, setOnlyOneWallTop] = useState("Top surfaces");
  const [topAreaThreshold, setTopAreaThreshold] = useState("200");
  const [onlyOneWallFirstLayer, setOnlyOneWallFirstLayer] = useState(false);
  const [detectOverhangWall, setDetectOverhangWall] = useState(true);
  const [smoothSpeedDiscontinuity, setSmoothSpeedDiscontinuity] = useState(true);
  const [smoothCoefficient, setSmoothCoefficient] = useState("80");
  const [avoidCrossingWall, setAvoidCrossingWall] = useState(false);
  const [maxDetourLength, setMaxDetourLength] = useState("0");
  const [avoidCrossingIncludesSupport, setAvoidCrossingIncludesSupport] =
    useState(false);
  const [smoothingWallSpeedAlongZ, setSmoothingWallSpeedAlongZ] = useState(false);

  return (
    <div
      className="process-tab-panel"
      data-figma-file-key={FIGMA_QUALITY_PANEL.fileKey}
      data-figma-node-id={FIGMA_QUALITY_PANEL.nodeId}
    >
      <TabPanelSection title="Layer height">
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
        <CheckboxField
          label="Mixed color sublayer"
          checked={mixedColorSublayer}
          onChange={(e) => setMixedColorSublayer(e.target.checked)}
        />
      </TabPanelSection>

      <TabPanelSection title="Line width">
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
      </TabPanelSection>

      <TabPanelSection title="Seam">
        <DropdownField
          label="Seam position"
          value={seamPosition}
          options={SEAM_POSITION_OPTIONS}
          onSelect={(option) => {
            setSeamPosition(option);
            setOpenDropdown(null);
          }}
          active={openDropdown === "seamPosition"}
          aria-expanded={openDropdown === "seamPosition"}
          aria-haspopup="listbox"
          onClick={() => toggleDropdown("seamPosition")}
        />
        <CheckboxField
          label="Seam placement away from overhangs (experimental)"
          checked={awayFromOverhangs}
          onChange={(e) => setAwayFromOverhangs(e.target.checked)}
        />
        <TextInputField
          label="Seam gap"
          value={seamGap}
          onChange={(e) => setSeamGap(e.target.value)}
          unit="%"
          inputMode="decimal"
        />
        <CheckboxField
          label="Smart scarf seam application"
          checked={smartScarfApplication}
          onChange={(e) => setSmartScarfApplication(e.target.checked)}
        />
        <TextInputField
          label="Scarf application angle threshold"
          value={scarfAngleThreshold}
          onChange={(e) => setScarfAngleThreshold(e.target.value)}
          unit="°"
          inputMode="numeric"
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
          label="Scarf joint for inner walls"
          checked={scarfJointInnerWalls}
          onChange={(e) => setScarfJointInnerWalls(e.target.checked)}
        />
        <CheckboxField
          label="Override filament scarf seam setting"
          checked={overrideFilamentScarf}
          onChange={(e) => setOverrideFilamentScarf(e.target.checked)}
        />
        <DropdownField
          label="Scarf seam type"
          value={scarfSeamType}
          options={SCARF_SEAM_TYPE_OPTIONS}
          onSelect={(option) => {
            setScarfSeamType(option);
            setOpenDropdown(null);
          }}
          active={openDropdown === "scarfSeamType"}
          aria-expanded={openDropdown === "scarfSeamType"}
          aria-haspopup="listbox"
          onClick={() => toggleDropdown("scarfSeamType")}
        />
        <TextInputField
          label="Scarf start height"
          value={scarfStartHeight}
          onChange={(e) => setScarfStartHeight(e.target.value)}
          unit="mm/%"
          inputMode="decimal"
        />
        <TextInputField
          label="Scarf slope gap"
          value={scarfSlopeGap}
          onChange={(e) => setScarfSlopeGap(e.target.value)}
          unit="mm/%"
          inputMode="decimal"
        />
        <TextInputField
          label="Scarf length"
          value={scarfLength}
          onChange={(e) => setScarfLength(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <TextInputField
          label="Wipe speed"
          value={wipeSpeed}
          onChange={(e) => setWipeSpeed(e.target.value)}
          unit="%"
          inputMode="decimal"
        />
        <CheckboxField
          label="Role-based wipe speed"
          checked={roleBaseWipeSpeed}
          onChange={(e) => setRoleBaseWipeSpeed(e.target.checked)}
        />
      </TabPanelSection>

      <TabPanelSection title="Precision">
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
          label="User Customized Offset"
          value={circleCompensationOffset}
          onChange={(e) => setCircleCompensationOffset(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <TextInputField
          label="Elephant foot compensation"
          value={elephantFootCompensation}
          onChange={(e) => setElephantFootCompensation(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <CheckboxField
          label="Precise wall"
          checked={preciseWall}
          onChange={(e) => setPreciseWall(e.target.checked)}
        />
        <CheckboxField
          label="Precise Z height"
          checked={preciseZHeight}
          onChange={(e) => setPreciseZHeight(e.target.checked)}
        />
      </TabPanelSection>

      <TabPanelSection title="Ironing">
        <DropdownField
          label="Ironing Type"
          value={ironingType}
          options={IRONING_TYPE_OPTIONS}
          onSelect={(option) => {
            setIroningType(option);
            setOpenDropdown(null);
          }}
          active={openDropdown === "ironingType"}
          aria-expanded={openDropdown === "ironingType"}
          aria-haspopup="listbox"
          onClick={() => toggleDropdown("ironingType")}
        />
        <DropdownField
          label="Ironing Pattern"
          value={ironingPattern}
          options={IRONING_PATTERN_OPTIONS}
          onSelect={(option) => {
            setIroningPattern(option);
            setOpenDropdown(null);
          }}
          showPattern
          active={openDropdown === "ironingPattern"}
          aria-expanded={openDropdown === "ironingPattern"}
          aria-haspopup="listbox"
          onClick={() => toggleDropdown("ironingPattern")}
        />
        <TextInputField
          label="Ironing speed"
          value={ironingSpeed}
          onChange={(e) => setIroningSpeed(e.target.value)}
          unit="mm/s"
          inputMode="decimal"
        />
        <TextInputField
          label="Ironing flow"
          value={ironingFlow}
          onChange={(e) => setIroningFlow(e.target.value)}
          unit="%"
          inputMode="decimal"
        />
        <TextInputField
          label="Ironing line spacing"
          value={ironingLineSpacing}
          onChange={(e) => setIroningLineSpacing(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <TextInputField
          label="Ironing inset"
          value={ironingInset}
          onChange={(e) => setIroningInset(e.target.value)}
          unit="mm"
          inputMode="decimal"
        />
        <TextInputField
          label="Ironing direction"
          value={ironingDirection}
          onChange={(e) => setIroningDirection(e.target.value)}
          unit="°"
          inputMode="decimal"
        />
      </TabPanelSection>

      <TabPanelSection title="Wall generator">
        <DropdownField
          label="Wall generator"
          value={wallGeneratorType}
          options={WALL_GENERATOR_OPTIONS}
          onSelect={(option) => {
            setWallGeneratorType(option);
            setOpenDropdown(null);
          }}
          active={openDropdown === "wallGeneratorType"}
          aria-expanded={openDropdown === "wallGeneratorType"}
          aria-haspopup="listbox"
          onClick={() => toggleDropdown("wallGeneratorType")}
        />
        {wallGeneratorType === "Arachne" ? (
          <>
            <TextInputField
              label="Wall transitioning threshold angle"
              value={wallTransitionAngle}
              onChange={(e) => setWallTransitionAngle(e.target.value)}
              unit="°"
              inputMode="decimal"
            />
            <TextInputField
              label="Wall transitioning filter margin"
              value={wallTransitionFilterMargin}
              onChange={(e) => setWallTransitionFilterMargin(e.target.value)}
              unit="%"
              inputMode="decimal"
            />
            <TextInputField
              label="Wall transition length"
              value={wallTransitionLength}
              onChange={(e) => setWallTransitionLength(e.target.value)}
              unit="%"
              inputMode="decimal"
            />
            <TextInputField
              label="Wall distribution count"
              value={wallDistributionCount}
              onChange={(e) => setWallDistributionCount(e.target.value)}
              showUnit={false}
              inputMode="numeric"
            />
            <TextInputField
              label="Minimum wall width"
              value={minWallWidth}
              onChange={(e) => setMinWallWidth(e.target.value)}
              unit="%"
              inputMode="decimal"
            />
            <TextInputField
              label="Minimum feature size"
              value={minFeatureSize}
              onChange={(e) => setMinFeatureSize(e.target.value)}
              unit="%"
              inputMode="decimal"
            />
          </>
        ) : null}
      </TabPanelSection>

      <TabPanelSection title="Advanced">
        <DropdownField
          label="Order of walls"
          value={orderOfWalls}
          options={ORDER_OF_WALLS_OPTIONS}
          onSelect={(option) => {
            setOrderOfWalls(option);
            setOpenDropdown(null);
          }}
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
          label="Bridge counterbore holes"
          value={counterboreHoleBridging}
          options={COUNTERBORE_HOLE_BRIDGING_OPTIONS}
          onSelect={(option) => {
            setCounterboreHoleBridging(option);
            setOpenDropdown(null);
          }}
          active={openDropdown === "counterboreHoleBridging"}
          aria-expanded={openDropdown === "counterboreHoleBridging"}
          aria-haspopup="listbox"
          onClick={() => toggleDropdown("counterboreHoleBridging")}
        />
        <TextInputField
          label="Object flow ratio"
          value={objectFlowRatio}
          onChange={(e) => setObjectFlowRatio(e.target.value)}
          showUnit={false}
          inputMode="decimal"
        />
        <TextInputField
          label="Top surface flow ratio"
          value={topSurfaceFlowRatio}
          onChange={(e) => setTopSurfaceFlowRatio(e.target.value)}
          showUnit={false}
          inputMode="decimal"
        />
        <TextInputField
          label="Initial layer flow ratio"
          value={initialLayerFlowRatio}
          onChange={(e) => setInitialLayerFlowRatio(e.target.value)}
          showUnit={false}
          inputMode="decimal"
        />
        <DropdownField
          label="Only one wall on top surfaces"
          value={onlyOneWallTop}
          options={ONLY_ONE_WALL_TOP_OPTIONS}
          onSelect={(option) => {
            setOnlyOneWallTop(option);
            setOpenDropdown(null);
          }}
          active={openDropdown === "onlyOneWallTop"}
          aria-expanded={openDropdown === "onlyOneWallTop"}
          aria-haspopup="listbox"
          onClick={() => toggleDropdown("onlyOneWallTop")}
        />
        <TextInputField
          label="Top area threshold"
          value={topAreaThreshold}
          onChange={(e) => setTopAreaThreshold(e.target.value)}
          unit="%"
          inputMode="decimal"
        />
        <CheckboxField
          label="Only one wall on first layer"
          checked={onlyOneWallFirstLayer}
          onChange={(e) => setOnlyOneWallFirstLayer(e.target.checked)}
        />
        <CheckboxField
          label="Detect overhang wall"
          checked={detectOverhangWall}
          onChange={(e) => setDetectOverhangWall(e.target.checked)}
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
        <TextInputField
          label="Avoid crossing wall - Max detour length"
          value={maxDetourLength}
          onChange={(e) => setMaxDetourLength(e.target.value)}
          unit="mm or %"
          inputMode="decimal"
        />
        <CheckboxField
          label="Avoid crossing wall - Includes support"
          checked={avoidCrossingIncludesSupport}
          onChange={(e) => setAvoidCrossingIncludesSupport(e.target.checked)}
        />
        <CheckboxField
          label="Smoothing wall speed along Z (experimental)"
          checked={smoothingWallSpeedAlongZ}
          onChange={(e) => setSmoothingWallSpeedAlongZ(e.target.checked)}
        />
      </TabPanelSection>
    </div>
  );
}
