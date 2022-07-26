import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Pick<DocItemDisplayDialogProps, "title" | "parent">>({
    defaultValues: {
      title: displayDialog.title,
      parent: displayDialog.parent,
    },
  });
  const onSubmit: SubmitHandler<{
    title: string;
    parent: string | null | undefined;
  }> = (data) => {
    updateDocumentMutation.mutate({
      id: displayDialog.id,
      ...data,
    });
    setDisplayDialog(DocItemDisplayDialogDefault);
  };

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
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="my-2">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <InputText
                className="w-full"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                autoFocus={true}
              />
            )}
          />
        </div>
        {!displayDialog.template && (
          <div className="my-2">
            <Controller
              name="parent"
              control={control}
              render={({ field }) => (
                <Dropdown
                  className="w-full"
                  placeholder="Document Folder"
                  optionLabel="title"
                  optionValue="id"
                  value={field.value}
                  filter
                  onChange={(e) => field.onChange(e.value)}
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
              )}
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
          />
        </div>
      </form>
    </Dialog>
  );
}
