import { AnimatePresence, motion } from "framer-motion";
import { LatLngBoundsExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { ImageOverlay, useMapEvents } from "react-leaflet";
import { useParams } from "react-router-dom";
import { Map } from "../../../custom-types";
import DraggableMarker from "./DraggableMarker";
import MarkerContextMenu from "./MarkerContextMenu";
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
  const mcm = useRef() as any;
  const [updateTokenDialog, setUpdateTokenDialog] = useState();
  const map = useMapEvents({
    contextmenu(e: any) {
      setNewTokenDialog({ ...e.latlng, show: false });
      cm.current.show(e.originalEvent);
    },
  });

  return (
    <>
      <MarkerContextMenu
        mcm={mcm}
        setUpdateTokenDialog={setUpdateTokenDialog}
      />
      ;
      <ImageOverlay url={src} bounds={bounds} ref={imgRef} />
      {markers.map((marker) => (
        <DraggableMarker key={marker.id} {...marker} mcm={mcm} />
      ))}
    </>
  );
}
