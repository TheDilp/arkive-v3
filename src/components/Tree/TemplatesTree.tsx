import { useAtom } from "jotai";
import { SplitButton } from "primereact/splitbutton";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem } from "../../CRUD/ItemsCRUD";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import BaseTree from "./BaseTree";

export default function TemplatesTree() {
  const { project_id } = useParams();
  const createDocumentMutation = useCreateItem("documents");
  const [, setDrawer] = useAtom(DrawerAtom);
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

  return (
    <div className="flex flex-col p-2">
      <SplitButton
        className="p-button-outlined"
        icon="pi pi-bolt"
        label="Quick Create"
        loading={createDocumentMutation.isLoading}
        model={items}
        onClick={() => {
          createDocumentMutation?.mutate({
            project_id: project_id as string,
            template: true,
            title: "New Template",
          });
        }}
      />
      <BaseTree isTemplates type="documents" />
    </div>
  );
}
