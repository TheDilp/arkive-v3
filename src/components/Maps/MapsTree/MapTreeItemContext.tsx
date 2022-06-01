import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ContextMenu } from "primereact/contextmenu";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mapItemDisplayDialogProps } from "../../../custom-types";
import { useDeleteMap, useUpdateMap } from "../../../utils/customHooks";
type Props = {
  cm: React.RefObject<ContextMenu>;
  mapId: string;
  displayDialog: mapItemDisplayDialogProps;
  setDisplayDialog: (displayDialog: mapItemDisplayDialogProps) => void;
};

export default function MapTreeItemContext({
  cm,
  mapId,
  displayDialog,
  setDisplayDialog,
}: Props) {
  const { project_id } = useParams();

  const deleteMapMutation = useDeleteMap();
  const updateMapMutation = useUpdateMap(project_id as string);
  const navigate = useNavigate();
  const confirmdelete = () => {
    confirmDialog({
      message: (
        <div>
          {`Are you sure you want to delete ${displayDialog.title}?`}
          {displayDialog.folder ? (
            <div style={{ color: "var(--red-400)" }}>
              <i className="pi pi-exclamation-triangle"></i>
              This will delete all the sub-folders & sub-maps in this folder!
            </div>
          ) : (
            ""
          )}
        </div>
      ),
      header: `Delete ${displayDialog.title}`,
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-outlined text-red-500",
      accept: async () => {
        if (displayDialog.id === mapId) {
          navigate("./");
        }
        deleteMapMutation.mutate({
          id: displayDialog.id,
          project_id: project_id as string,
        });
        setDisplayDialog({ ...displayDialog, show: false });
      },
      reject: () => {},
    });
  };
  const mapItems = [
    {
      label: "Update Map",
      icon: "pi pi-fw pi-pencil",
      command: () => setDisplayDialog({ ...displayDialog, show: true }),
    },
    {
      label: "Toggle Public",
      icon: `pi pi-fw ${displayDialog.public ? "pi-eye" : "pi-eye-slash"}`,
      command: () =>
        updateMapMutation.mutate({
          id: displayDialog.id,
          public: !displayDialog.public,
        }),
    },
    { separator: true },
    {
      label: "View Public Map",
      icon: "pi pi-fw pi-link",
      command: () => navigate(`/view/${project_id}/maps/${displayDialog.id}`),
    },
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
        model={displayDialog.folder ? folderItems : mapItems}
        ref={cm}
        className="Lato"
      />
    </>
  );
}
