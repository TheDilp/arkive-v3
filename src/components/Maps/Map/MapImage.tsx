import { LatLngBoundsExpression } from "leaflet";
import { ImageOverlay, useMapEvents } from "react-leaflet";
import { useParams } from "react-router-dom";
import DraggableMarker from "./DraggableMarker";
type Props = {
  src: string;
  bounds: LatLngBoundsExpression;
  imgRef: any;
};

export default function MapImage({ src, bounds, imgRef }: Props) {
  const { map_id } = useParams();
  const map = useMapEvents({
    contextmenu() {
      alert("AYYY");
    },
  });

  return (
    <>
      <ImageOverlay url={src} bounds={bounds} ref={imgRef} />
      <DraggableMarker />
    </>
  );
}
