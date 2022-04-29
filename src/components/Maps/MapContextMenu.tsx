import { ContextMenu } from "primereact/contextmenu";
import React from "react";
import { useParams } from "react-router-dom";
import { useCreateMapMarker } from "../../utils/customHooks";
type Props = {
  cm: any;
  lat: number;
  lng: number;
  bounds: number[][];
  setNewTokenDialog: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number; show: boolean }>
  >;
};

export default function MapContextMenu({
  cm,
  setNewTokenDialog,
  lat,
  lng,
  bounds,
}: Props) {
  const createMapMarkerMutation = useCreateMapMarker();
  const { project_id } = useParams();
  const items = [
    {
      label: "New Token",
      icon: "pi pi-fw pi-map-marker",
      command: () => setNewTokenDialog((prev) => ({ ...prev, show: true })),
    },
  ];
  if (lat > bounds[1][0] || lng > bounds[1][1] || lat < 0 || lng < 0) {
    return null;
  }
  return <ContextMenu model={items} ref={cm} />;
}
