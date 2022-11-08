import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Dialog } from "primereact/dialog";
import { useParams } from "react-router-dom";
import { ProjectType } from "../../types/projectTypes";
import { DialogAtom } from "../../utils/atoms";
import { InputText } from "primereact/inputtext";
import { DocumentType } from "../../types/documentTypes";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useUpdateDocument } from "../../CRUD/DocumentCRUD";
import { recursiveDescendantFilter } from "../../utils/recursive";
type Props = {};

const DialogContent = {
  documents: (allItems: DocumentType[] | undefined, item: DocumentType) => (
    <RenameDocument allItems={allItems} item={item} />
  ),
};

export default function DialogWrapper({}: Props) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useAtom(DialogAtom);
  const projectData = queryClient.getQueryData<ProjectType>([
    "singleProject",
    project_id,
  ]);
  //! REPLACE WITH JUST if dialog.type later
  if (projectData)
    if (dialog.type === "documents") {
      const item = projectData[dialog.type]?.find(
        (item) => item.id === dialog.id
      );
      if (item)
        return (
          <Dialog
            header={`Edit ${item.title}`}
            visible={dialog.id !== null}
            onHide={() => setDialog({ id: null, type: null })}
          >
            {DialogContent[dialog.type](projectData[dialog.type], item)}
          </Dialog>
        );
    }

  return null;
}

function RenameDocument({
  allItems,
  item,
}: {
  allItems: DocumentType[] | undefined;
  item: DocumentType;
}) {
  const updateDocumentMutation = useUpdateDocument();
  const [localItem, setLocalItem] = useState(item);
  return (
    <div className="my-2">
      <InputText
        className="w-full"
        value={localItem.title}
        onChange={(e) =>
          setLocalItem((prev) => ({ ...prev, title: e.target.value }))
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateDocumentMutation.mutate({
              id: item.id,
              title: localItem.title,
              parent: localItem.parent,
            });
          }
        }}
        autoFocus={true}
      />
      {!localItem.template && (
        <div className="my-2">
          <Dropdown
            className="w-full"
            placeholder="Document Folder"
            optionLabel="title"
            optionValue="id"
            value={localItem.parent}
            filter
            onChange={(e) => {
              setLocalItem((prev) => ({ ...prev, parent: e.value }));
            }}
            options={
              allItems
                ? allItems.filter((doc, idx, array) => {
                    if (!doc.folder || doc.id === item.id) return false;
                    return recursiveDescendantFilter(doc, idx, array, item.id);
                  })
                : [{ title: "Root", id: null }]
            }
          />
        </div>
      )}
      <div className="flex w-full">
        <Button
          className="ml-auto p-button-outlined p-button-success"
          label="Save"
          icon="pi pi-fw pi-save"
          iconPos="right"
          type="submit"
          onClick={() =>
            updateDocumentMutation.mutate({
              id: item.id,
              title: localItem.title,
              parent: localItem.parent,
            })
          }
        />
      </div>
    </div>
  );
}
