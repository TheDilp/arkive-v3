import React from "react";
import { ContextMenu } from "primereact/contextmenu";
import { useCreateMapMarker } from "../../utils/customHooks";
import { v4 as uuid } from "uuid";
import { useParams } from "react-router-dom";
type Props = { cm: any };

export default function MapContextMenu({ cm }: Props) {
  const createMapMarkerMutation = useCreateMapMarker();
  const { project_id } = useParams();
  const items = [
    {
      label: "New Token",
      icon: "pi pi-fw pi-bookmark-fill",
      command: () => {
        let id = uuid();

        createMapMarkerMutation.mutate({
          id,
          lat: 500,
          lng: 500,
          project_id: project_id as string,
          map_id: "ed7e030a-4129-4eff-8a60-227b2ee43a87",
        });
      },
    },
  ];
  return <ContextMenu model={items} ref={cm} />;
}
