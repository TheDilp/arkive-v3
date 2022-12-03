import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useCreateItem } from "../../CRUD/ItemsCRUD";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import BaseTree from "./BaseTree";

export default function MapsTree() {
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const createMapMutation = useCreateItem("maps");

  const items = useMemo(
    () => [
      {
        command: () =>
          setDrawer({
            ...DefaultDrawer,
            position: "right",
            show: true,
            type: "documents",
          }),
        icon: "pi pi-file",
        label: "Create Document",
      },
      {
        command: () => {
          setDrawer({
            ...DefaultDrawer,
            exceptions: { fromTemplate: true },
            position: "right",
            show: true,
            type: "documents",
          });
        },
        icon: "pi pi-copy",
        label: "Create from Template",
      },
    ],
    [],
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-zinc-600 pb-2">
        <Button
          className="p-button-outlined p-button-secondary"
          label="New Folder"
          icon="pi pi-folder"
          onClick={() => {
            createMapMutation?.mutate({
              folder: true,
              project_id: project_id as string,
              title: "New Folder",
            });
          }}
        />
        <Button
          className="p-button-outlined"
          label="New Map"
          icon="pi pi-map"
          onClick={() => {
            setDrawer({
              ...DefaultDrawer,
              position: "right",
              show: true,
              type: "maps",
            });
          }}
        />
      </div>

      <BaseTree type="maps" />
    </div>
  );
}
