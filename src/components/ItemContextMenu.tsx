import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ContextMenu } from "primereact/contextmenu";
import React, { useLayoutEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { dialogType, DocumentProps } from "../custom-types";
import { useCreateDocument } from "../utils/customHooks";
import { v4 as uuid } from "uuid";
import { toastWarn } from "../utils/utils";
import { saveAs } from "file-saver";
type Props = {
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
  displayDialog: dialogType;
  setDisplayDialog: React.Dispatch<React.SetStateAction<dialogType>>;
  updateMutation: any;
  deleteMutation: any;
  cm: any;
};

export default function ItemContextMenu({
  id,
  setId,
  displayDialog,
  setDisplayDialog,
  updateMutation,
  deleteMutation,
  cm,
}: Props) {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState<any>([]);
  const createDocumentMutation = useCreateDocument(project_id as string);
  const confirmdelete = () => {
    if (displayDialog.type === "Map") {
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
          if (displayDialog.id === id) {
            navigate("./");
          }
          deleteMutation.mutate({
            id: displayDialog.id,
            project_id: project_id as string,
          });
          setDisplayDialog({ ...displayDialog, show: false });
        },
        reject: () => {},
      });
    }
  };
  const queryClient = useQueryClient();

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
            updateMutation.mutate({
              id: displayDialog.id,
              folder: false,
            }),
        },
        {
          label: "Folder",
          icon: "pi pi-fw pi-folder",
          command: () =>
            updateMutation.mutate({
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
        const documents: DocumentProps[] | undefined =
          queryClient.getQueryData(`${project_id}-documents`) || [];
        const document = documents.find((doc) => doc.id === displayDialog.id);
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
        const documents: DocumentProps[] | undefined =
          queryClient.getQueryData(`${project_id}-documents`) || [];
        const document = documents.find((doc) => doc.id === displayDialog.id);
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
      label: "Delete Document",
      icon: "pi pi-fw pi-trash",
      command: confirmdelete,
    },
  ];
  const docFolderItems = [
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
            updateMutation.mutate({
              id: displayDialog.id,
              folder: false,
            }),
        },
        {
          label: "Folder",
          icon: "pi pi-fw pi-folder",
          command: () =>
            updateMutation.mutate({
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
        updateMutation.mutate({
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
  const mapFolderItems = [
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

  useLayoutEffect(() => {
    if (displayDialog.type === "Document") {
      if ("template" in displayDialog && displayDialog.template) {
        setModel(templateItems);
      } else if (displayDialog.folder) {
        setModel(docFolderItems);
      } else {
        setModel(docItems);
      }
    } else if (displayDialog.type === "Map") {
      if (displayDialog.folder) {
        setModel(mapFolderItems);
      } else {
        setModel(mapItems);
      }
    }
  }, [displayDialog]);

  return (
    <>
      <ConfirmDialog />
      <ContextMenu model={model} ref={cm} className="Lato" />
    </>
  );
}
