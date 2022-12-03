import { useAtom } from "jotai";
import { SplitButton } from "primereact/splitbutton";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useCreateItem } from "../../CRUD/ItemsCRUD";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import BaseTree from "./BaseTree";

export default function DocumentsTree() {
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const createDocumentMutation = useCreateItem("documents");

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

  return (
    <>
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

      <BaseTree type="documents" />
    </>
  );
}
