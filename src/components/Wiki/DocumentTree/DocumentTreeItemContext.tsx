import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ContextMenu } from "primereact/contextmenu";
import React, { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import {
  DocumentProps,
  DocItemDisplayDialogProps,
} from "../../../custom-types";
import {
  useCreateDocument,
  useCreateTemplate,
  useDeleteDocument,
  useUpdateDocument,
} from "../../../utils/customHooks";
import { toastSuccess, toastWarn } from "../../../utils/utils";
import { saveAs } from "file-saver";
import { ProjectContext } from "../../Context/ProjectContext";
import { DocumentCreateDefault } from "../../../utils/defaultValues";
type Props = {
  cm: React.RefObject<ContextMenu>;
  displayDialog: DocItemDisplayDialogProps;
  setDisplayDialog: (displayDialog: DocItemDisplayDialogProps) => void;
};

export default function DocumentTreeItemContext({
  cm,
  displayDialog,
  setDisplayDialog,
}: Props) {
  const queryClient = useQueryClient();
  const [deleteToggle, setDeleteToggle] = useState(false);
  const { project_id, doc_id } = useParams();
  const navigate = useNavigate();
  const { id: docId } = useContext(ProjectContext);
  const confirmdelete = () => setDeleteToggle(true);
  const documents: DocumentProps[] | undefined =
    queryClient.getQueryData(`${project_id}-documents`) || [];
  const document = documents.find((doc) => doc.id === displayDialog.id);

  const createDocumentMutation = useCreateDocument(project_id as string);
  const updateDocumentMutation = useUpdateDocument(project_id as string);
  const deleteDocumentMutation = useDeleteDocument(project_id as string);

  // Get all the folders a document can be moved to

  const templateItems = [
    {
      label: "Edit Document",
      icon: "pi pi-fw pi-pencil",
      command: () => setDisplayDialog({ ...displayDialog, show: true }),
    },

    {
      label: "Create Doc From Template",
      icon: "pi pi-fw pi-copy",
      command: () => {
        // let doc = documents.find((doc) => doc.id === displayDialog.id);
        // if (doc) {
        //   if (doc.content) {
        //     let id = uuid();
        //     let vars = {
        //       ...doc,
        //       id,
        //       title: `${doc.title}`,
        //     };
        //     // @ts-ignore
        //     createTemplateMutation.mutate(vars);
        //   } else {
        //     toastWarn("Document is empty, cannot convert to template");
        //   }
        // }
      },
    },
    { separator: true },
    {
      label: "Delete Document",
      icon: "pi pi-fw pi-trash",
      command: confirmdelete,
    },
  ];
  const docItems = [
    {
      label: "Edit Document",
      icon: "pi pi-fw pi-pencil",
      command: () => setDisplayDialog({ ...displayDialog, show: true }),
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
              id: displayDialog.id,
              folder: false,
            }),
        },
        {
          label: "Folder",
          icon: "pi pi-fw pi-folder",
          command: () =>
            updateDocumentMutation.mutate({
              id: displayDialog.id,
              folder: true,
            }),
        },
      ],
    },
    {
      label: "Covert to Template",
      icon: "pi pi-fw pi-copy",
      command: () => {
        if (document) {
          if (document.content) {
            let id = uuid();
            let vars = {
              ...document,
              id,
              title: `${document.title}`,
            };
            createDocumentMutation.mutate({
              ...vars,
              parent: null,
              template: true,
            });
          } else {
            toastWarn("Document is empty, cannot convert to template");
          }
        }
      },
    },
    {
      label: "Export JSON",
      icon: "pi pi-fw pi-download",
      command: () => {
        if (document)
          saveAs(
            new Blob([JSON.stringify(document)], {
              type: "text/plain;charset=utf-8",
            }),
            `${document.title}.json`
          );
      },
    },
    { separator: true },
    {
      label: "View Public Document",
      icon: "pi pi-fw pi-external-link",
      command: () => navigate(`/view/${project_id}/wiki/${displayDialog.id}`),
    },
    {
      label: "Copy Public URL",
      icon: "pi pi-fw pi-link",
      command: () => {
        if (navigator && navigator.clipboard) {
          navigator.clipboard
            .writeText(
              `${window.location.host}/view/${project_id}/wiki/${displayDialog.id}`
            )
            .then(() => {
              toastSuccess("URL copied! 🔗");
            });
        }
      },
    },
    {
      label: "Delete Document",
      icon: "pi pi-fw pi-trash",
      command: confirmdelete,
    },
  ];
  const folderItems = [
    {
      label: "Edit Folder",
      icon: "pi pi-fw pi-pencil",
      command: () => setDisplayDialog({ ...displayDialog, show: true }),
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
              id: displayDialog.id,
              folder: false,
            }),
        },
        {
          label: "Folder",
          icon: "pi pi-fw pi-folder",
          command: () =>
            updateDocumentMutation.mutate({
              id: displayDialog.id,
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
              createDocumentMutation.mutate({
                id: uuid(),
                ...DocumentCreateDefault,
                project_id: project_id as string,
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
              createDocumentMutation.mutate({
                id: uuid(),
                ...DocumentCreateDefault,
                project_id: project_id as string,
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
      label: "Delete Folder",
      icon: "pi pi-fw pi-trash",
      command: confirmdelete,
    },
  ];
  const rootItems = [
    {
      label: "New Document",
      icon: "pi pi-fw pi-file",
      command: () => {
        let id = uuid();
        createDocumentMutation.mutate({
          id,
          ...DocumentCreateDefault,
          project_id: project_id as string,
          title: "New Document",
          parent: doc_id || null,
        });
      },
    },
    {
      label: "New Folder",
      icon: "pi pi-fw pi-folder",
      command: () => {
        let id = uuid();
        createDocumentMutation.mutate({
          id,
          ...DocumentCreateDefault,
          project_id: project_id as string,
          title: "New Folder",
          parent: doc_id || null,
          folder: true,
        });
      },
    },
  ];
  return (
    <>
      <ConfirmDialog
        message={
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
        }
        header={`Delete ${displayDialog.title}`}
        icon="pi pi-exclamation-triangle"
        acceptClassName="text-red-500 p-button-outlined"
        accept={async () => {
          if (displayDialog.id === docId) {
            navigate("./");
          }
          deleteDocumentMutation.mutate({
            id: displayDialog.id,
            folder: displayDialog.folder,
          });
          setDisplayDialog({ ...displayDialog, show: false });
        }}
        visible={deleteToggle}
        onHide={() => setDeleteToggle(false)}
        reject={() => setDeleteToggle(false)}
      />
      <ContextMenu
        model={
          displayDialog.root
            ? rootItems
            : displayDialog.template
            ? templateItems
            : displayDialog.folder
            ? folderItems
            : docItems
        }
        ref={cm}
        className="Lato"
      />
    </>
  );
}
