import { ContextMenu } from "primereact/contextmenu";
import { useParams } from "react-router-dom";
import { useDeleteMapMarker } from "../../../../utils/customHooks";
type Props = {
  mcm: any;
  marker_id: string;
  setUpdateTokenDialog: any;
};

export default function MarkerContextMenu({
  mcm,
  marker_id,
  setUpdateTokenDialog,
}: Props) {
  const { project_id, map_id } = useParams();
  const deleteMarkerMutation = useDeleteMapMarker();
  const items = [
    {
      label: "Update Marker",
      icon: "pi pi-fw pi-map-marker",
      command: () =>
        setUpdateTokenDialog((prev: any) => {
          return {
            ...prev,
            show: true,
          };
        }),
    },
    {
      label: "Delete Token",
      icon: "pi pi-fw pi-trash",
      command: () =>
        deleteMarkerMutation.mutate({
          id: marker_id,
          project_id: project_id as string,
          map_id: map_id as string,
        }),
    },
  ];
  return <ContextMenu model={items} ref={mcm} />;
}
