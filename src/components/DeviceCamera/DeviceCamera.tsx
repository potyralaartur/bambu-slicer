import { useState } from "react";

import { CameraControlBar } from "../CameraControlBar/CameraControlBar";
import { IconButton } from "../IconButton/IconButton";
import { TabList } from "../TabList/TabList";
import { FigmaIcon } from "../../icons";

import "./DeviceCamera.css";

const ASSET_BASE = `${import.meta.env.BASE_URL}assets/device/`;
const VIEW_NAMES = ["Camera", "Timelapse", "History"] as const;
type DeviceView = (typeof VIEW_NAMES)[number];

export function DeviceCamera() {
  const [activeView, setActiveView] = useState<DeviceView>("Camera");

  return (
    <main className="device-camera" aria-label="Device camera">
      <div className="device-view-bar">
        <TabList
          className="device-view-bar__views"
          tabClassName="device-view-bar__tab"
          tabs={VIEW_NAMES}
          activeTab={activeView}
          onTabChange={setActiveView}
          ariaLabel="Device views"
        />

        <div className="device-view-bar__actions" aria-label="Camera view actions">
          <IconButton className="device-view-bar__refresh" aria-label="Refresh camera">
            <FigmaIcon name="arrow-refresh" size={20} />
          </IconButton>
          <IconButton aria-label="Fit camera view">
            <FigmaIcon name="resize" size={20} />
          </IconButton>
          <IconButton aria-label="Open picture in picture">
            <span className="device-view-bar__pip-icon" aria-hidden>
              <img src={`${ASSET_BASE}picture-in-picture.svg`} alt="" />
            </span>
          </IconButton>
        </div>
      </div>

      <div className="device-camera__viewport" role="tabpanel" aria-label={activeView}>
        <div className="device-camera__feed-frame">
          <img
            className="device-camera__feed"
            src={`${ASSET_BASE}camera-feed.png`}
            alt="Live view of the Bambu Lab P1S build plate"
          />
          <div className="device-camera__vignette" aria-hidden />

          <div className="device-live-badge" aria-label="Live, 1080p at 30 frames per second">
            <img className="device-live-badge__dot" src={`${ASSET_BASE}live-dot.svg`} alt="" />
            <span className="device-live-badge__label">Live</span>
            <span className="device-live-badge__quality">1080p · 30fps</span>
          </div>

          <CameraControlBar className="device-camera__controls" />
        </div>
      </div>
    </main>
  );
}
