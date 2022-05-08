import { LatLngBoundsExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { ImageOverlay, useMapEvents } from "react-leaflet";
import { MapProps } from "../../../custom-types";
import DraggableMarker from "./MapMarker/DraggableMarker";
import MarkerContextMenu from "./MapMarker/MarkerContextMenu";
import UpdateMarkerDialog from "./MapMarker/UpdateMarkerDialog";
type Props = {
  src: string;
  bounds: LatLngBoundsExpression;
  imgRef: any;
  cm: any;
  markers: MapProps["markers"];
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
  const [updateMarkerDialog, setUpdateMarkerDialog] = useState<{
    id: string;
    text: string;
    icon: string;
    color: string;
    doc_id?: string;
    map_link?: string;
    show: boolean;
  }>({
    id: "",
    text: "",
    icon: "",
    color: "",
    doc_id: "",
    map_link: "",
    show: false,
  });
  const map = useMapEvents({
    contextmenu(e: any) {
      setNewTokenDialog({ ...e.latlng, show: false });
      cm.current.show(e.originalEvent);
    },
  });
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
      <MarkerContextMenu
        mcm={mcm}
        marker_id={updateMarkerDialog.id}
        setUpdateTokenDialog={setUpdateMarkerDialog}
      />
      {updateMarkerDialog.show && (
        <UpdateMarkerDialog
          {...updateMarkerDialog}
          setVisible={() =>
            setUpdateMarkerDialog({
              id: "",
              text: "",
              icon: "",
              color: "",
              doc_id: "",
              show: false,
            })
          }
        />
      )}
      <ImageOverlay url={src} bounds={bounds} ref={imgRef} />
      {markers
        .filter((marker) => (markerFilter ? marker.map_link : true))
        .map((marker) => (
          <DraggableMarker
            key={marker.id}
            {...marker}
            mcm={mcm}
            setUpdateMarkerDialog={setUpdateMarkerDialog}
          />
        ))}
    </>
  );
}
