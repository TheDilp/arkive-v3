import { LatLngBoundsExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { ImageOverlay } from "react-leaflet";
import { MapProps } from "../../../types/MapTypes";
import PublicDraggableMarker from "./PublicDraggableMarker";
type Props = {
  src: string;
  bounds: LatLngBoundsExpression;
  imgRef: any;
  cm: any;
  markers: MapProps["markers"];
};

export default function PublicMapImage({
  src,
  bounds,
  imgRef,
  cm,
  markers,
}: Props) {
  const mcm = useRef() as any;

  const [markerFilter, setMarkerFilter] = useState(false);
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.shiftKey) {
        setMarkerFilter(true);
      }
    });
    document.addEventListener("keyup", (e) => {
      if (!e.shiftKey) {
        setMarkerFilter(false);
      }
    });
    return () => {
      document.removeEventListener("keydown", () => {});
      document.removeEventListener("keyup", () => {});
    };
  }, []);
  return (
    <>
      <ImageOverlay url={src} bounds={bounds} ref={imgRef} />
      {markers
        .filter((marker) => (markerFilter ? marker.map_link : true))
        .map((marker) => (
          <PublicDraggableMarker key={marker.id} {...marker} mcm={mcm} />
        ))}
    </>
  );
}
