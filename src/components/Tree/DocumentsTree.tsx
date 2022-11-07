import React from "react";
import BaseTree from "./BaseTree";
import { SplitButton } from "primereact/splitbutton";
import { v4 as uuid } from "uuid";
import { trpc } from "../../utils/trpcClient";
import { useCreateDocument } from "../../CRUD/DocumentCRUD";
import { useParams } from "react-router-dom";
import { DefaultDocument } from "../../utils/DefaultValues/DocumentDefaults";

type Props = {};

const items = [
  {
    label: "Create Document",
    icon: "pi pi-file",
    command: () => {},
  },
  {
    label: "Create Folder",
    icon: "pi pi-folder",
    command: () => {},
  },
  {
    label: "Create from Template",
    icon: "pi pi-copy",
    command: () => {},
  },
];

export default function DocumentsTree({}: Props) {
  const { project_id } = useParams();
  // const createDocumentMutation = useCreateDocument();
  return (
    <div className="flex flex-column">
      <SplitButton
        className="p-button-outlined"
        label="Quick Create"
        icon="pi pi-bolt"
        model={items}
        onClick={() => {
          let id = uuid();
          // createDocumentMutation.mutate({
          //   id,
          //   title: "New Document",
          //   project_id: project_id as string,
          // });
        }}
      />
      <BaseTree type="documents" />
    </div>
  );
}
