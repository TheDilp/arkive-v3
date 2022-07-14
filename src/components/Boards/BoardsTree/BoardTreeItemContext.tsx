import { Icon } from "@iconify/react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ContextMenu } from "primereact/contextmenu";
import React from "react";
import { To, useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { BoardItemDisplayDialogProps } from "../../../types/BoardTypes";
import {
  useCreateBoard,
  useDeleteBoard,
  useUpdateBoard,
} from "../../../utils/customHooks";
import { toastWarn } from "../../../utils/utils";
type Props = {
  cm: React.RefObject<ContextMenu>;
  boardId: string;
  displayDialog: BoardItemDisplayDialogProps;
  setDisplayDialog: (displayDialog: BoardItemDisplayDialogProps) => void;
};

export default function BoardTreeItemContext({
  cm,
  boardId,
  displayDialog,
  setDisplayDialog,
}: Props) {
  const { project_id } = useParams();
  const newBoardMutation = useCreateBoard();
  const updateBoardMutation = useUpdateBoard(project_id as string);
  const deleteBoardMutation = useDeleteBoard(project_id as string);
  const navigate = useNavigate();
  const confirmDelete = () => {
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
      acceptClassName: "p-button-outlined text-red-400",
      accept: async () => {
        await deleteBoardMutation.mutateAsync({
          id: displayDialog.id,
        });
        setDisplayDialog({ ...displayDialog, show: false });
        if (displayDialog.id === boardId) {
          navigate(-1 as To);
        }
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
      label: "Toggle Public",
      icon: `pi pi-fw ${displayDialog.public ? "pi-eye" : "pi-eye-slash"}`,
      command: () =>
        updateBoardMutation.mutate({
          id: displayDialog.id,
          public: !displayDialog.public,
        }),
    },
    { separator: true },
    {
      label: "View Public Board",
      icon: "pi pi-fw pi-link",
      command: () => navigate(`/view/${project_id}/boards/${displayDialog.id}`),
    },
    {
      label: "Delete Board",
      icon: "pi pi-fw pi-trash",
      command: confirmDelete,
    },
  ];
  const folderItems = [
    {
      label: "Rename Folder",
      icon: "pi pi-fw pi-pencil",
      command: () => setDisplayDialog({ ...displayDialog, show: true }),
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
      command: confirmDelete,
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
