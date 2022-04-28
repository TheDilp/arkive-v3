import React from "react";
import { ContextMenu } from "primereact/contextmenu";
import { useCreateMapMarker } from "../../../utils/customHooks";
import { v4 as uuid } from "uuid";
import { useParams } from "react-router-dom";
type Props = {
  mcm: any;
  setUpdateTokenDialog: any;
};

export default function MarkerContextMenu({
  mcm,
  setUpdateTokenDialog,
}: Props) {
  const createMapMarkerMutation = useCreateMapMarker();
  const { project_id } = useParams();
  const items = [
    {
      label: "Update Token",
      icon: "pi pi-fw pi-map-marker",
    },
    {
      label: "Delete Token",
      icon: "pi pi-fw pi-trash",
    },
  ];
  return <ContextMenu model={items} ref={mcm} />;
}
