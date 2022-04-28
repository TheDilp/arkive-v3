import React from "react";
import { ContextMenu } from "primereact/contextmenu";
import { useCreateMapMarker } from "../../../utils/customHooks";
import { v4 as uuid } from "uuid";
import { useParams } from "react-router-dom";
type Props = {
  cm: any;
  setNewTokenDialog: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number; show: boolean }>
  >;
};

export default function MarkerContextMenu({ cm, setNewTokenDialog }: Props) {
  const createMapMarkerMutation = useCreateMapMarker();
  const { project_id } = useParams();
  const items = [
    {
      label: "New Token",
      icon: "pi pi-fw pi-map-marker",
      command: () => setNewTokenDialog((prev) => ({ ...prev, show: true })),
    },
  ];
  return <ContextMenu model={items} ref={cm} />;
}
