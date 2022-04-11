import React from "react";
import { ContextMenu } from "primereact/contextmenu";
import { Document, treeItemDisplayDialog } from "../../../custom-types";
import { deleteDocument, updateDocument } from "../../../utils/supabaseUtils";
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

  // async function updateParent(doc_id: string, parent: string | null) {

  //     .then((data: Document | undefined) => {
  //       if (data) {
  //         // ! THIS RERENDERS THE TREE
  //         // setDisplayDialog({ id: "", title: "", show: false });
  //         let updatedDocument = data;
  //         queryClient.setQueryData(
  //           `${project_id}-documents`,
  //           (oldData: Document[] | undefined) => {
  //             if (oldData) {
  //               let newData: Document[] = oldData.map((doc) => {
  //                 if (doc.id === updatedDocument.id) {
  //                   return { ...doc, parent: updatedDocument.parent };
  //                 } else {
  //                   return doc;
  //                 }
  //               });
  //               return newData;
  //             } else {
  //               return [];
  //             }
  //           }
  //         );
  //       }
  //     })
  //     .catch((err) => toastError("There was an error updating the document"));
  // }
  const updateParent = useMutation(
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
    }
  );

  const moveToOptions = [
    {
      label: "Root",
      command: (item: any) => {
        updateParent.mutate({ doc_id: displayDialog.id, parent: null });
      },
    },
    ...folders.map((folder) => ({
      label: folder.title,
      command: (item: any) => {
        updateParent.mutate({
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
