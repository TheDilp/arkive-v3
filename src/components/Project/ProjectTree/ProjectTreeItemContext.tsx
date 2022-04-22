import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ContextMenu } from "primereact/contextmenu";
import React from "react";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Document, treeItemDisplayDialog } from "../../../custom-types";
import { deleteDocument } from "../../../utils/supabaseUtils";
import { toastSuccess, toastWarn } from "../../../utils/utils";
import {
  useCreateDocument,
  useCreateTemplate,
  useDeleteDocument,
  useUpdateDocument,
} from "../../../utils/customHooks";
import { v4 as uuid } from "uuid";
type Props = {
  docId: string;
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
  const deleteDocumentMutation = useDeleteDocument(project_id as string);
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
        deleteDocumentMutation.mutate({
          doc_id: displayDialog.id,
          folder: displayDialog.folder,
        });
        setDisplayDialog({ ...displayDialog, show: false });
      },
      reject: () => {},
    });
  };
  const documents: Document[] | undefined =
    queryClient.getQueryData(`${project_id}-documents`) || [];
  let folders = documents.filter((doc) => doc.folder);

  const updateDocumentMutation = useUpdateDocument(project_id as string);
  const newDocumentMutation = useCreateDocument(project_id as string);
  const createTemplateMutation = useCreateTemplate();
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
      icon: "pi pi-fw pi-sync",
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
      label: "Covert to Template",
      icon: "pi pi-fw pi-copy",
      command: () => {
        let doc = documents.find((doc) => doc.id === displayDialog.id);
        if (doc) {
          if (doc.content) {
            let id = uuid();
            let vars = {
              ...doc,
              id,
              title: `${doc.title}`,
            };
            // @ts-ignore
            createTemplateMutation.mutate(vars);
          } else {
            toastWarn("Document is empty, cannot convert to template");
          }
        }
      },
    },
    { separator: true },
    {
      label: "Delete Document",
      icon: "pi pi-fw pi-trash",
      command: confirmdelete,
    },
  ];
  const folderItems = [
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
    {
      label: "Insert Into Folder",
      icon: "pi pi-fw pi-plus",
      items: [
        {
          label: "Insert Document",
          icon: "pi pi-fw pi-file",
          command: () => {
            if (displayDialog.depth < 3) {
              newDocumentMutation.mutate({
                id: uuid(),
                parent: displayDialog.id,
                folder: false,
              });
            } else {
              toastWarn("You cannot insert more than 4 levels deep.");
            }
          },
        },
        {
          label: "Insert Folder",
          icon: "pi pi-fw pi-folder",
          command: () => {
            if (displayDialog.depth < 3) {
              newDocumentMutation.mutate({
                id: uuid(),
                title: "New Folder",
                parent: displayDialog.id,
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
      label: "Delete Document",
      icon: "pi pi-fw pi-trash",
      command: confirmdelete,
    },
  ];
  return (
    <>
      <ConfirmDialog />
      <ContextMenu
        model={displayDialog.folder ? folderItems : items}
        ref={cm}
        className="Lato"
      />
    </>
  );
}
