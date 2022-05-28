import React from "react";
import MapView from "../../Maps/Map/MapView";
import PublicMapView from "./PublicMapView";

type Props = {};

export default function PublicMaps({}: Props) {
  return (
    <div className="w-full h-full">
      <PublicMapView />;
    </div>
  );
}
