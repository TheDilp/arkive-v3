import React from "react";
import { ContextMenu } from "primereact/contextmenu";
import { Document, treeItemDisplayDialog } from "../../../custom-types";
import {
  deleteDocument,
  updateDocument,
  updateMultipleDocumentsParents,
} from "../../../utils/supabaseUtils";
import { toastError, toastSuccess } from "../../../utils/utils";
import { useMutation, useQueryClient } from "react-query";
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

  // Mutation to update the parent of a file
  const updateParentMutation = useMutation(
    async (vars: { doc_id: string; parent: string | null }) =>
      await updateDocument(
        vars.doc_id,
        undefined,
        undefined,
        undefined,
        undefined,
        vars.parent
      ),
    {
      onMutate: async (updatedDocument) => {
        await queryClient.cancelQueries(`${project_id}-documents`);

        const previousDocuments = queryClient.getQueryData(
          `${project_id}-documents`
        );
        queryClient.setQueryData(
          `${project_id}-documents`,
          (oldData: Document[] | undefined) => {
            if (oldData) {
              let newData: Document[] = oldData.map((doc) => {
                if (doc.id === updatedDocument.doc_id) {
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

        return { previousDocuments };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-documents`,
          context?.previousDocuments
        );
      },
    }
  );

  const updateTypeMutation = useMutation(
    async (vars: { doc_id: string; folder: boolean }) =>
      await updateDocument(
        vars.doc_id,
        undefined,
        undefined,
        undefined,
        vars.folder
      ),
    {
      onMutate: async (updatedDocument) => {
        await queryClient.cancelQueries(`${project_id}-documents`);

        const previousDocuments = queryClient.getQueryData(
          `${project_id}-documents`
        );
        queryClient.setQueryData(
          `${project_id}-documents`,
          (oldData: Document[] | undefined) => {
            if (oldData) {
              let newData: Document[] = oldData.map((doc) => {
                if (doc.id === updatedDocument.doc_id) {
                  return { ...doc, folder: updatedDocument.folder };
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

        if (!updatedDocument.folder) {
          let children: Document[] | undefined = queryClient.getQueryData(
            `${project_id}-documents`
          );

          // If the folder is changing back to a document
          // Updated the children's (if there are any) parent to the root folder
          // Otherwise the user won't be able to access the children if this doesn't occur
          // Since the children will be still under the parent which cannot be expanded if it is a file type

          if (children) {
            children = children
              .filter((child) => child.parent === updatedDocument.doc_id)
              .map((child) => ({ ...child, parent: null }));
            updateMultipleDocumentsParents(children);

            queryClient.setQueryData(
              `${project_id}-documents`,
              (oldData: Document[] | undefined) => {
                if (oldData) {
                  let newData: Document[] = oldData.map((doc) => {
                    if (doc.parent === updatedDocument.doc_id) {
                      return { ...doc, parent: null };
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
          }
        }

        return { previousDocuments };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-documents`,
          context?.previousDocuments
        );
      },
      onSuccess: (data, vars) => {},
    }
  );

  // Get all the folders a document can be moved to
  const moveToOptions = [
    {
      label: "Root",
      command: (item: any) => {
        updateParentMutation.mutate({ doc_id: displayDialog.id, parent: null });
      },
    },
    ...folders.map((folder) => ({
      label: folder.title,
      command: (item: any) => {
        updateParentMutation.mutate({
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
            updateTypeMutation.mutate({ doc_id: displayDialog.id, folder: false }),
        },
        {
          label: "Folder",
          icon: "pi pi-fw pi-folder",
          command: () =>
            updateTypeMutation.mutate({ doc_id: displayDialog.id, folder: true }),
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
