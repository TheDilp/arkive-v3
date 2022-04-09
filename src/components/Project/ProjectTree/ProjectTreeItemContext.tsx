import React from "react";
import { ContextMenu } from "primereact/contextmenu";
import { treeItemDisplayDialog } from "../../../custom-types";

type Props = {
  cm: React.RefObject<ContextMenu>;
  displayDialog: treeItemDisplayDialog;
  setDisplayDialog: (displayDialog: treeItemDisplayDialog) => void;
};

export default function ProjectTreeItemContext({
  cm,
  displayDialog,
  setDisplayDialog,
}: Props) {
  const items = [
    {
      label: "Rename Document",
      icon: "pi pi-fw pi-pencil",
      command: () => setDisplayDialog({ ...displayDialog, show: true }),
    },
  ];
  return <ContextMenu model={items} ref={cm} />;
}
