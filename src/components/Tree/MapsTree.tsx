import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";
import { useCreateMutation, useGetAllDocuments, useGetAllMaps } from "../../CRUD/ItemsCRUD";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DocumentDefaults";
import BaseTree from "./BaseTree";

export default function DocumentsTree() {
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
            console.log({
              folder: true,
              project_id: project_id as string,
              title: "New Folder",
            });
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
            createMapMutation?.mutate({
              project_id: project_id as string,
              title: "New Map",
            });
          }}
        />
      </div>

      {data ? <BaseTree data={data} type="maps" /> : null}
    </div>
  );
}
