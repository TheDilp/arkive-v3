import { LatLngBoundsExpression } from "leaflet";
import { ImageOverlay, useMapEvents } from "react-leaflet";
import { useParams } from "react-router-dom";
import { Map } from "../../../custom-types";
import DraggableMarker from "./DraggableMarker";
type Props = {
  src: string;
  bounds: LatLngBoundsExpression;
  imgRef: any;
  cm: any;
  markers: Map["markers"];
  setNewTokenDialog: (newTokenDialog: {
    lat: number;
    lng: number;
    show: boolean;
  }) => void;
};

export default function MapImage({
  src,
  bounds,
  imgRef,
  cm,
  markers,
  setNewTokenDialog,
}: Props) {
  const map = useMapEvents({
    contextmenu(e: any) {
      setNewTokenDialog({ ...e.latlng, show: false });
      cm.current.show(e.originalEvent);
    },
  });

  return (
    <>
      <ImageOverlay url={src} bounds={bounds} ref={imgRef} />
      {markers.map((marker) => (
        <DraggableMarker key={marker.id} {...marker} />
      ))}
    </>
  );
}
