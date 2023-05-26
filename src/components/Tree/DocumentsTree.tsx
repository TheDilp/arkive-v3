import { useAtomValue, useSetAtom } from "jotai";
import { SplitButton } from "primereact/splitbutton";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem } from "../../CRUD/ItemsCRUD";
import { DrawerAtom, RoleAtom, ThemeAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import BaseTree from "./BaseTree";

export default function DocumentsTree() {
  const { project_id } = useParams();
  const setDrawer = useSetAtom(DrawerAtom);
  const theme = useAtomValue(ThemeAtom);
  const createDocumentMutation = useCreateItem("documents");
  const permissions = useAtomValue(RoleAtom);

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
        label: "Create Document (Detailed)",
      },
      {
        command: () =>
          createDocumentMutation?.mutate({
            folder: true,
            project_id: project_id as string,
            title: "New Folder",
          }),
        icon: "pi pi-folder",
        label: "Create Folder",
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
    <div className={`h-screen p-4 ${theme === "dark" ? "" : "border-r bg-white"}`}>
      <SplitButton
        className="p-button-outlined w-full"
        disabled={permissions !== "owner" && typeof permissions === "object" && permissions?.documents !== "Edit"}
        icon="pi pi-plus"
        label="Create Document"
        loading={createDocumentMutation?.isLoading}
        model={items}
        onClick={() => {
          createDocumentMutation?.mutate({
            project_id: project_id as string,
            title: "New Document",
          });
        }}
      />
      <BaseTree type="documents" />
    </div>
  );
}
