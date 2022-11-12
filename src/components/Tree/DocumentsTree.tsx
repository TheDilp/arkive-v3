import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { InputText } from "primereact/inputtext";
import { SplitButton } from "primereact/splitbutton";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCreateMutation, useGetAllDocuments } from "../../CRUD/DocumentCRUD";
import { DocumentType } from "../../types/documentTypes";
import { DrawerAtom } from "../../utils/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DocumentDefaults";
import BaseTree from "./BaseTree";

export default function DocumentsTree() {
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const createDocumentMutation = useCreateMutation("documents");
  const { data, isLoading, error } = useGetAllDocuments(project_id as string);

  const items = [
    {
      command: () =>
        setDrawer({ ...DefaultDrawer, type: "documents", show: true }),
      icon: "pi pi-file",
      label: "Create Document",
    },
    {
      command: () => {},
      icon: "pi pi-folder",
      label: "Create Folder",
    },
    {
      command: () => {},
      icon: "pi pi-copy",
      label: "Create from Template",
    },
  ];

  if (isLoading) return "Loading";
  if (error) return "error";
  return (
    <div className="flex flex-col">
      <SplitButton
        className="p-button-outlined"
        label="Quick Create"
        icon={<Icon icon="mdi:lightning-bolt-outline" fontSize={20} />}
        dropdownIcon={<Icon icon="mdi:chevron-down" fontSize={24} />}
        model={items}
        onClick={() => {
          createDocumentMutation?.mutate({
            project_id: project_id as string,
            title: "New Document",
          });
        }}
      />

      {data ? <BaseTree data={data} type="documents" /> : null}
    </div>
  );
}
