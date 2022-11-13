import { useAtom } from "jotai";
import { SplitButton } from "primereact/splitbutton";
import { useParams } from "react-router-dom";
import { useCreateMutation, useGetAllDocuments } from "../../CRUD/DocumentCRUD";
import { DrawerAtom } from "../../utils/Atoms/atoms";
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
        setDrawer({
          ...DefaultDrawer,
          type: "documents",
          position: "right",
          show: true,
        }),
      icon: "pi pi-file",
      label: "Create Document",
    },
    {
      command: () => {},
      icon: "pi pi-copy",
      label: "Create from Template",
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error </div>;

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

      {data ? (
        <BaseTree data={data.filter((doc) => !doc.template)} type="documents" />
      ) : null}
    </div>
  );
}
