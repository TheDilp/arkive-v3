import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useCreateMutation, useGetAllMaps } from "../../CRUD/ItemsCRUD";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DocumentDefaults";
import BaseTree from "./BaseTree";

export default function MapsTree() {
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const createMapMutation = useCreateMutation("maps");
  const { data, isLoading, error } = useGetAllMaps(project_id as string);

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error </div>;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-600">
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
          className="p-button-outlined p-button-success"
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

      {data ? <BaseTree data={data} type="maps" /> : null}
    </div>
  );
}
