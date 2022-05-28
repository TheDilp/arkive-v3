import { Button } from "primereact/button";
import React from "react";
import { useCreateMap } from "../../../utils/customHooks";
import { v4 as uuid } from "uuid";
import { useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";

type Props = {
  setCreateMapDialog: (show: boolean) => void;
  filter: string;
  setFilter: (filter: string) => void;
};

export default function MapsFilter({
  setCreateMapDialog,
  filter,
  setFilter,
}: Props) {
  const { project_id } = useParams();
  const createMapMutation = useCreateMap();

  return (
    <div className="w-full py-1 flex justify-content-between align-items-start flex-wrap">
      <div className="w-full py-2">
        <InputText
          className="w-full"
          placeholder="Search Maps"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <Button
        label="New Folder"
        icon="pi pi-fw pi-folder"
        iconPos="right"
        className="p-button-outlined"
        onClick={() => {
          let id = uuid();
          createMapMutation.mutate({
            id,
            project_id: project_id as string,
            title: "New Folder",
            map_image: undefined,
            folder: true,
            expanded: false,
          });
        }}
      />
      <Button
        label="New Map"
        icon="pi pi-fw pi-map"
        iconPos="right"
        className="p-button-outlined"
        onClick={() => setCreateMapDialog(true)}
      />
    </div>
  );
}
