import { SplitButton } from "primereact/splitbutton";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { useCreateDocument } from "../../CRUD/DocumentCRUD";
import BaseTree from "./BaseTree";

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
  const createDocumentMutation = useCreateDocument();
  return (
    <div className="flex flex-column">
      <SplitButton
        className="p-button-outlined"
        label="Quick Create"
        icon="pi pi-bolt"
        model={items}
        onClick={() => {
          createDocumentMutation.mutate({
            title: "New Document",
            project_id: project_id as string,
          });
        }}
      />
      <BaseTree type="documents" />
    </div>
  );
}
