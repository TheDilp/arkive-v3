import { SplitButton } from "primereact/splitbutton";
import { useParams } from "react-router-dom";
import { useCreateMutation, useGetAllDocuments } from "../../CRUD/DocumentCRUD";
import BaseTree from "./BaseTree";

type Props = {};

const items = [
  {
    label: "Create Template",
    icon: "pi pi-file",
    command: () => {},
  },
  {
    label: "Create from Template",
    icon: "pi pi-copy",
    command: () => {},
  },
];

export default function TemplatesTree({}: Props) {
  const { project_id } = useParams();
  const createDocumentMutation = useCreateMutation("documents");
  const { data, isLoading, error } = useGetAllDocuments(project_id as string);
  if (isLoading || error) return "Loading...";

  return (
    <div className="flex flex-col">
      <SplitButton
        className="p-button-outlined"
        label="Quick Create"
        icon="pi pi-bolt"
        model={items}
        onClick={() => {
          createDocumentMutation?.mutate({
            title: "New Document",
            project_id: project_id as string,
          });
        }}
      />
      {data ? (
        <BaseTree data={data.filter((doc) => doc.template)} type="documents" />
      ) : null}
    </div>
  );
}
