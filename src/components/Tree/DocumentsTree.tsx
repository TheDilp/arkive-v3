import { SplitButton } from "primereact/splitbutton";
import { useParams } from "react-router-dom";
import { useCreateMutation, useGetAllDocuments } from "../../CRUD/DocumentCRUD";
import BaseTree from "./BaseTree";

const items = [
  {
    command: () => {},
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

export default function DocumentsTree() {
  const { project_id } = useParams();
  const createDocumentMutation = useCreateMutation("documents");
  const { data, isLoading, error } = useGetAllDocuments(project_id as string);
  if (isLoading) return "Loading";
  if (error) return "error";
  return (
    <div className="flex flex-col">
      <SplitButton
        className="p-button-outlined"
        label="Quick Create"
        icon="pi pi-bolt"
        model={items}
        onClick={() => {
          createDocumentMutation?.mutate({
            project_id: project_id as string,
            title: "New Document",
          });
        }}
      />
      <BaseTree data={data} type="documents" />
    </div>
  );
}
