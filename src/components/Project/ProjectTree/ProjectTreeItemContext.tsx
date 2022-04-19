import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ContextMenu } from "primereact/contextmenu";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Document, treeItemDisplayDialog } from "../../../custom-types";
import {
  auth,
  deleteDocument,
  updateDocument,
  updateMultipleDocumentsParents,
} from "../../../utils/supabaseUtils";
import {
  toastSuccess,
  useGetProjectData,
  useUpdateDocument,
} from "../../../utils/utils";
type Props = {
  cm: React.RefObject<ContextMenu>;
  displayDialog: treeItemDisplayDialog;
  setDisplayDialog: (displayDialog: treeItemDisplayDialog) => void;
  setPermissionDialog: (permissionDialog: treeItemDisplayDialog) => void;
};

export default function ProjectTreeItemContext({
  cm,
  displayDialog,
  setDisplayDialog,
  setPermissionDialog,
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
      owner: true,
      label: "Move To",
      icon: "pi pi-fw pi-directions",
      items: moveToOptions,
    },
    {
      owner: true,
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
    {
      owner: true,
      label: "Change Permission",
      icon: "pi pi-fw pi-user-edit",
      command: () => setPermissionDialog({ ...displayDialog, show: true }),
    },
    { owner: true, separator: true },
    {
      owner: true,
      label: "Delete Document",
      icon: "pi pi-fw pi-trash",
      command: confirmdelete,
    },
  ].filter((item) => (item.owner ? user?.id === project?.user_id : true));
  return (
    <>
      <ConfirmDialog />
      <ContextMenu model={items} ref={cm} className="Lato" />
    </>
  );
}
