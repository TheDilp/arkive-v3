import { Icon } from "@iconify/react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ContextMenu } from "primereact/contextmenu";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { boardItemDisplayDialogProps } from "../../../custom-types";
import {
  useCreateBoard,
  useDeleteBoard,
  useUpdateBoard,
  useUpdateNode,
} from "../../../utils/customHooks";
import { boardLayouts, toastWarn } from "../../../utils/utils";
type Props = {
  cm: React.RefObject<ContextMenu>;
  boardId: string;
  displayDialog: boardItemDisplayDialogProps;
  setDisplayDialog: (displayDialog: boardItemDisplayDialogProps) => void;
  cyRef: any;
};

export default function BoardTreeItemContext({
  cm,
  boardId,
  displayDialog,
  setDisplayDialog,
  cyRef,
}: Props) {
  const { project_id } = useParams();

  const newBoardMutation = useCreateBoard();
  const updateBoardMutation = useUpdateBoard(project_id as string);
  const deleteBoardMutation = useDeleteBoard(project_id as string);
  const updateNodeMutation = useUpdateNode(project_id as string);
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
      acceptClassName: "p-button-danger",
      accept: async () => {
        if (displayDialog.id === boardId) {
          navigate("./");
        }
        deleteBoardMutation.mutate({
          id: displayDialog.id,
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

    {
      label: "Convert To Preset",
      command: () => {
        if (boardId === displayDialog.id && cyRef.current) {
          const nodes = cyRef.current.nodes();
          for (const node of nodes) {
            const { x, y } = node.position();
            updateNodeMutation.mutate({
              id: node.id(),
              board_id: displayDialog.id,
              x,
              y,
            });
          }
        }
      },
    },
    {
      label: "Set Default Layout",
      items: [
        ...boardLayouts.map((layout) => {
          return {
            label: layout,
            command: () => {
              updateBoardMutation.mutate({
                id: displayDialog.id,
                layout,
              });
            },
          };
        }),
      ],
    },
    { separator: true },
    {
      label: "Delete Board",
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
              layout: "Preset",
              nodes: [],
              edges: [],
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
                layout: "Preset",
                nodes: [],
                edges: [],
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
