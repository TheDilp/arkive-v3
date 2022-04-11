import React from "react";
import { ContextMenu } from "primereact/contextmenu";
import { Document, treeItemDisplayDialog } from "../../../custom-types";
import { deleteDocument, updateDocument } from "../../../utils/supabaseUtils";
import { toastSuccess } from "../../../utils/utils";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
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
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const navigate = useNavigate();
  const confirmdelete = () => {
    confirmDialog({
      message: `Are you sure you want to delete ${displayDialog.title}?`,
      header: `Delete ${displayDialog.title}`,
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        await deleteDocument(displayDialog.id).then(() => {
          toastSuccess("Document deleted");
          queryClient.setQueryData(
            `${project_id}-documents`,
            (oldData: Document[] | undefined) => {
              if (oldData) {
                return oldData.filter(
                  (document: Document) => document.id !== displayDialog.id
                );
              } else {
                return [];
              }
            }
          );
        });
        setDisplayDialog({ ...displayDialog, show: false });
        navigate("./");
      },
      reject: () => {},
    });
  };
  let folders: Document[] | undefined =
    queryClient.getQueryData(`${project_id}-documents`) || [];
  folders = folders.filter((folder) => folder.folder);

  const updateParent = async (doc_id: string, parent: string) => {
    const updatedDocument = await updateDocument(
      displayDialog.id,
      undefined,
      undefined,
      undefined,
      undefined,
      parent
    );
    if (updatedDocument)
      queryClient.setQueryData(
        `${project_id}-documents`,
        (oldData: Document[] | undefined) => {
          if (oldData) {
            let newData: Document[] = oldData.map((doc) => {
              if (doc.id === updatedDocument.id) {
                return { ...doc, parent: updatedDocument.parent };
              } else {
                return doc;
              }
            });
            return newData;
          } else {
            return [];
          }
        }
      );
  };

  const items = [
    {
      label: "Rename Document",
      icon: "pi pi-fw pi-pencil",
      command: () => setDisplayDialog({ ...displayDialog, show: true }),
    },
    {
      label: "Move To",
      icon: "pi pi-fw pi-directions",
      items: folders.map((folder) => ({
        label: folder.title,
        command: async () => {
          await updateParent(displayDialog.id, folder.id);
          setDisplayDialog({ ...displayDialog, show: false });
        },
      })),
    },
    {
      label: "Change Type",
      icon: "pi pi-fw, pi-sync",
      items: [
        {
          label: "Document",
          icon: "pi pi-fw pi-file",
        },
        { label: "Folder", icon: "pi pi-fw pi-folder" },
      ],
    },
    { separator: true },
    {
      label: "Delete Document",
      icon: "pi pi-fw pi-trash",
      command: confirmdelete,
    },
  ];
  return (
    <>
      <ConfirmDialog />
      <ContextMenu model={items} ref={cm} />
    </>
  );
}
