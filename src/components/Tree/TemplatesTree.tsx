import { useAtom } from "jotai";
import { SplitButton } from "primereact/splitbutton";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useCreateMutation, useGetAllDocuments } from "../../CRUD/ItemsCRUD";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import BaseTree from "./BaseTree";

export default function TemplatesTree() {
  const { project_id } = useParams();
  const createDocumentMutation = useCreateMutation("documents");
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const items = useMemo(
    () => [
      {
        command: () =>
          setDrawer({
            ...DefaultDrawer,
            exceptions: {
              createTemplate: true,
            },
            position: "right",
            show: true,
            type: "documents",
          }),
        icon: "pi pi-file",
        label: "Create Template",
      },
    ],
    [],
  );
  const { data, isLoading, error } = useGetAllDocuments(project_id as string);
  if (isLoading || error) return <span>Loading...</span>;

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
            template: true,
            title: "New Template",
          });
        }}
      />
      {data ? <BaseTree data={data.filter((doc) => doc.template)} type="documents" /> : null}
    </div>
  );
}
