import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ContextMenu } from "primereact/contextmenu";
import React from "react";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Document, treeItemDisplayDialog } from "../../../custom-types";
import { auth, deleteDocument } from "../../../utils/supabaseUtils";
import { toastSuccess } from "../../../utils/utils";
import {
  useGetProjectData,
  useUpdateDocument,
} from "../../../utils/customHooks";
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
  const { project_id, doc_id } = useParams();
  const user = auth.user();
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
        if (doc_id === displayDialog.id) navigate("./");
      },
      reject: () => {},
    });
  };
  let folders: Document[] | undefined =
    queryClient.getQueryData(`${project_id}-documents`) || [];
  folders = folders.filter((folder) => folder.folder);

  const updateDocumentMutation = useUpdateDocument(project_id as string);
  const project = useGetProjectData(project_id as string);
  // Get all the folders a document can be moved to
  const moveToOptions = [
    {
      label: "Root",
      command: (item: any) => {
        updateDocumentMutation.mutate({
          doc_id: displayDialog.id,
          parent: null,
        });
      },
    },
    ...folders.map((folder) => ({
      label: folder.title,
      command: (item: any) => {
        updateDocumentMutation.mutate({
          doc_id: displayDialog.id,
          parent: folder.id,
        });
      },
    })),
  ];

  const items = [
    {
      label: "Rename Document",
      icon: "pi pi-fw pi-pencil",
      command: () => setDisplayDialog({ ...displayDialog, show: true }),
    },
    {
      label: "Move To",
      icon: "pi pi-fw pi-directions",
      items: moveToOptions,
    },
    {
      label: "Change Type",
      icon: "pi pi-fw, pi-sync",
      items: [
        {
          label: "Document",
          icon: "pi pi-fw pi-file",
          command: () =>
            updateDocumentMutation.mutate({
              doc_id: displayDialog.id,
              folder: false,
            }),
        },
        {
          label: "Folder",
          icon: "pi pi-fw pi-folder",
          command: () =>
            updateDocumentMutation.mutate({
              doc_id: displayDialog.id,
              folder: true,
            }),
        },
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
      <ContextMenu model={items} ref={cm} className="Lato" />
    </>
  );
}
