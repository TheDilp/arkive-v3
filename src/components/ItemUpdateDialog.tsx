import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  BoardProps,
  dialogType,
  DocumentProps,
  ImageProps,
  MapProps,
} from "../custom-types";

type Props = {
  displayDialog: dialogType;
  dialogDefault: dialogType;
  setDisplayDialog: Dispatch<SetStateAction<dialogType>>;
  data: (DocumentProps | MapProps | BoardProps)[] | null;
  updateMutation: any;
};

export default function ItemUpdateDialog({
  displayDialog,
  setDisplayDialog,
  data,
  dialogDefault,
  updateMutation,
}: Props) {
  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ title: string; parent: string | null; map_image?: ImageProps }>(
    {
      defaultValues: {
        title: displayDialog.title,
        parent: displayDialog.parent || undefined,
        ...("map_image" in displayDialog && {
          map_image: displayDialog.map_image,
        }),
      },
    }
  );
  const onSubmit: SubmitHandler<{
    title: string;
    parent: string | null | undefined;
  }> = (data) => {
    updateMutation.mutate({
      id: displayDialog.id,
      ...data,
    });
    setDisplayDialog(dialogDefault);
  };

  useEffect(() => {
    if (displayDialog) {
      setValue("title", displayDialog.title);
      setValue("parent", displayDialog.parent);
      if ("map_image" in displayDialog) {
        setValue("map_image", displayDialog.map_image);
      }
    }
  }, [displayDialog]);

  function recursiveDescendantFilter(
    doc: DocumentProps | MapProps | BoardProps,
    index: number,
    array: (DocumentProps | MapProps | BoardProps)[],
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
      onHide={() => setDisplayDialog(dialogDefault)}
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
        {/* Show folder dropdown for all except document templates */}
        {"template" in displayDialog && !displayDialog.template && (
          <div className="my-2">
            <Controller
              name="parent"
              control={control}
              render={({ field }) => (
                <Dropdown
                  className="w-full"
                  placeholder="Folder"
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
        <div className="my-2"></div>
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
