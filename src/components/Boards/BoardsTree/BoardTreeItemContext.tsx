import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ContextMenu } from "primereact/contextmenu";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { mapItemDisplayDialog } from "../../../custom-types";
import {
  useCreateMap,
  useCreateTemplate,
  useDeleteDocument,
  useDeleteMap,
  useGetMapData,
  useUpdateDocument,
  useUpdateMap,
} from "../../../utils/customHooks";
import { toastWarn } from "../../../utils/utils";
type Props = {
  cm: React.RefObject<ContextMenu>;
  mapId: string;
  displayDialog: mapItemDisplayDialog;
  setDisplayDialog: (displayDialog: mapItemDisplayDialog) => void;
};

export default function MapTreeItemContext({
  cm,
  mapId,
  displayDialog,
  setDisplayDialog,
}: Props) {
  const { project_id } = useParams();
  const map = useGetMapData(project_id as string, mapId);

  const newMapMutation = useCreateMap();
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
        if (displayDialog.id === mapId) {
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

  const docItems = [
    {
      label: "Update Map",
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
          label: "Insert Map",
          icon: "pi pi-fw pi-file",
          command: () => setDisplayDialog({ ...displayDialog, show: true }),
        },
        {
          label: "Insert Folder",
          icon: "pi pi-fw pi-folder",
          command: () => {
            if (displayDialog.depth < 3) {
              newMapMutation.mutate({
                id: uuid(),
                title: "New Folder",
                parent: displayDialog.id,
                map_image: "",
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
      label: "Delete Map",
      icon: "pi pi-fw pi-trash",
      command: confirmdelete,
    },
  ];
  return (
    <>
      <ConfirmDialog />
      <ContextMenu
        model={displayDialog.folder ? folderItems : docItems}
        ref={cm}
        className="Lato"
      />
    </>
  );
}
