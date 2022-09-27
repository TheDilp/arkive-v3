import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React from "react";
import { useParams } from "react-router-dom";
import {
  DocItemDisplayDialogProps,
  DocumentProps,
} from "../../../custom-types";
import { useGetDocuments, useUpdateDocument } from "../../../utils/customHooks";
import { DocItemDisplayDialogDefault } from "../../../utils/defaultValues";

type Props = {
  displayDialog: DocItemDisplayDialogProps;
  setDisplayDialog: React.Dispatch<
    React.SetStateAction<DocItemDisplayDialogProps>
  >;
};

export default function DocumentUpdateDialog({
  displayDialog,
  setDisplayDialog,
}: Props) {
  const { project_id } = useParams();
  const updateDocumentMutation = useUpdateDocument(project_id as string);
  const { data } = useGetDocuments(project_id as string);

  function recursiveDescendantFilter(
    doc: DocumentProps,
    index: number,
    array: DocumentProps[],
    selected_id: string
  ): boolean {
    if (doc.parent === null) {
      return true;
    } else {
      const parent = array.find((d) => d.id === doc.parent?.id);
      if (parent) {
        if (parent.id === selected_id) {
          return false;
        } else {
          return recursiveDescendantFilter(parent, index, array, selected_id);
        }
      } else {
        return false;
      }
    }
  }

  return (
    <Dialog
      header={`Edit ${displayDialog.title}`}
      visible={displayDialog.show}
      className="w-3"
      onHide={() => setDisplayDialog(DocItemDisplayDialogDefault)}
      modal={false}
    >
      <div className="my-2">
        <InputText
          className="w-full"
          value={displayDialog.title}
          onChange={(e) =>
            setDisplayDialog((prev) => ({ ...prev, title: e.target.value }))
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateDocumentMutation.mutate({
                id: displayDialog.id,
                title: displayDialog.title,
                parent: displayDialog.parent,
              });
            }
          }}
          autoFocus={true}
        />
      </div>
      {!displayDialog.template && (
        <div className="my-2">
          <Dropdown
            className="w-full"
            placeholder="Document Folder"
            optionLabel="title"
            optionValue="id"
            value={displayDialog.parent}
            filter
            onChange={(e) =>
              setDisplayDialog((prev) => ({ ...prev, parent: e.value }))
            }
            options={
              data
                ? [
                    { title: "Root", id: null },
                    ...data.filter((doc, idx, array) => {
                      if (!doc.folder || doc.id === displayDialog.id)
                        return false;
                      return recursiveDescendantFilter(
                        doc,
                        idx,
                        array,
                        displayDialog.id
                      );
                    }),
                  ]
                : []
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
          onClick={() => {
            updateDocumentMutation.mutate({
              id: displayDialog.id,
              title: displayDialog.title,
              parent: displayDialog.parent,
            });
            setDisplayDialog(DocItemDisplayDialogDefault);
          }}
        />
      </div>
    </Dialog>
  );
}
