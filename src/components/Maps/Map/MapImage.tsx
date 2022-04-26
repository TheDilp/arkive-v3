import { LatLngBoundsExpression } from "leaflet";
import { ImageOverlay, useMapEvents } from "react-leaflet";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import DraggableMarker from "./DraggableMarker";
import { Map } from "../../../custom-types";
type Props = {
  src: string;
  bounds: LatLngBoundsExpression;
  imgRef: any;
  markers: Map["markers"];
};

export default function MapImage({ src, bounds, imgRef, markers }: Props) {
  const { project_id, map_id } = useParams();
  const queryClient = useQueryClient();
  const map = useMapEvents({
    contextmenu() {
      alert("AYYY");
    },
  });

  return (
    <>
      <ImageOverlay url={src} bounds={bounds} ref={imgRef} />
      {markers.map((marker) => (
        <DraggableMarker
          key={marker.id}
          icon={marker.icon}
          color={marker.color}
        />
      ))}
    </>
  );
}
