import { Icon } from "@iconify/react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ContextMenu } from "primereact/contextmenu";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { boardItemDisplayDialog } from "../../../custom-types";
import { useCreateBoard, useDeleteMap } from "../../../utils/customHooks";
import { toastWarn } from "../../../utils/utils";
type Props = {
  cm: React.RefObject<ContextMenu>;
  boardId: string;
  displayDialog: boardItemDisplayDialog;
  setDisplayDialog: (displayDialog: boardItemDisplayDialog) => void;
};

export default function BoardTreeItemContext({
  cm,
  boardId,
  displayDialog,
  setDisplayDialog,
}: Props) {
  const { project_id } = useParams();

  const newBoardMutation = useCreateBoard();
  const deleteDocumentMutation = useDeleteMap();
  const navigate = useNavigate();
  const confirmdelete = () => {
    confirmDialog({
      message: (
        <div>
          {`Are you sure you want to delete ${displayDialog.title}?`}
          {displayDialog.folder ? (
            <div style={{ color: "var(--red-400)" }}>
              <i className="pi pi-exclamation-triangle"></i>
              This will delete all the sub-documents in this folder!
            </div>
          ) : (
            ""
          )}
        </div>
      ),
      header: `Delete ${displayDialog.title}`,
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        if (displayDialog.id === boardId) {
          navigate("./");
        }
        deleteDocumentMutation.mutate({
          id: displayDialog.id,
          project_id: project_id as string,
        });
        setDisplayDialog({ ...displayDialog, show: false });
      },
      reject: () => {},
    });
  };

  const boardItems = [
    {
      label: "Update Board",
      icon: "pi pi-fw pi-pencil",
      command: () => setDisplayDialog({ ...displayDialog, show: true }),
    },
    {
      label: "Move To",
      icon: "pi pi-fw pi-directions",
    },

    { separator: true },
    {
      label: "Delete Map",
      icon: "pi pi-fw pi-trash",
      command: confirmdelete,
    },
  ];
  const folderItems = [
    {
      label: "Rename Folder",
      icon: "pi pi-fw pi-pencil",
      command: () => setDisplayDialog({ ...displayDialog, show: true }),
    },
    {
      label: "Move To",
      icon: "pi pi-fw pi-directions",
    },
    {
      label: "Insert Into Folder",
      icon: "pi pi-fw pi-plus",
      items: [
        {
          label: "Insert Board",
          template: (item: any, options: any) => {
            return (
              <span className={options.className} onClick={options.onClick}>
                <span className="p-button-icon p-c p-button-icon-left pi pi-fw">
                  <Icon icon={"mdi:draw"} fontSize={18} />
                </span>
                <span className={options.labelClassName}>{item.label}</span>
              </span>
            );
          },
          command: () =>
            newBoardMutation.mutate({
              id: uuid(),
              title: "New Board",
              parent: displayDialog.id,
              project_id: project_id as string,
              folder: false,
              nodes: [],
            }),
        },
        {
          label: "Insert Folder",
          icon: "pi pi-fw pi-folder",
          command: () => {
            if (displayDialog.depth < 3) {
              newBoardMutation.mutate({
                id: uuid(),
                title: "New Folder",
                parent: displayDialog.id,
                project_id: project_id as string,
                folder: true,
                nodes: [],
              });
            } else {
              toastWarn("You cannot insert more than 4 levels deep.");
            }
          },
        },
      ],
    },
    { separator: true },
    {
      label: "Delete Folder",
      icon: "pi pi-fw pi-trash",
      command: confirmdelete,
    },
  ];
  return (
    <>
      <ConfirmDialog />
      <ContextMenu
        model={displayDialog.folder ? folderItems : boardItems}
        ref={cm}
        className="Lato"
      />
    </>
  );
}
