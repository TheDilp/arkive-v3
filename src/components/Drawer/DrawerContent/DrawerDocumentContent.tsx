import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem, useDeleteItem, useGetAllImages, useUpdateItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { useGetItem } from "../../../hooks/useGetItem";
import { baseURLS, getURLS } from "../../../types/CRUDenums";
import { DocumentCreateType, DocumentType } from "../../../types/documentTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { DefaultDocument } from "../../../utils/DefaultValues/DocumentDefaults";
import { DropdownFilter } from "../../../utils/filters";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { ImageDropdownItem } from "../../Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../../Dropdown/ImageDropdownValue";
import { IconSelect } from "../../IconSelect/IconSelect";
import Tags from "../../Tags/Tags";
import { handleCloseDrawer } from "../Drawer";

export default function DrawerDocumentContent() {
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);

  const queryClient = useQueryClient();
  const allDocuments: DocumentType[] | undefined = queryClient.getQueryData(["allItems", project_id, "documents"]);
  const { data: document } = useGetItem(drawer?.id as string, "documents", { enabled: !!drawer?.id }) as { data: DocumentType };
  const { data: images } = useGetAllImages(project_id as string);

  const createDocumentMutation = useCreateItem("documents");
  const updateDocumentMutation = useUpdateItem("documents", project_id as string);
  const deleteDocumentMutation = useDeleteItem("documents", project_id as string);
  // Use item if editing or use a blank document (default values) if not to create new one
  const [localItem, setLocalItem] = useState<DocumentType | DocumentCreateType>(
    document ?? {
      ...DefaultDocument,
      project_id: project_id as string,
      template: drawer.exceptions?.createTemplate || false,
    },
  );
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });

  function CreateUpdateDocument(newData: DocumentCreateType) {
    if (document) {
      if (allDocuments?.some((item) => item?.parent?.id === newData.id) && !newData.folder) {
        toaster("warning", "Cannot convert to file if folder contains files.");
        return;
      }
      if (!changedData) {
        toaster("info", "No data was changed.");
        return;
      }
      updateDocumentMutation?.mutate(
        {
          id: document.id,
          ...changedData,
        },
        {
          onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ["allItems", project_id, "documents"] });
            if ("tags" in changedData) queryClient.refetchQueries({ queryKey: ["allTags", project_id, "documents"] });
            toaster("success", "Document successfully updated.");
          },
        },
      );
    } else {
      createDocumentMutation?.mutate(
        {
          ...DefaultDocument,
          ...newData,
        },
        {
          onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ["allItems", project_id, "documents"] });
            if ("tags" in newData) queryClient.refetchQueries({ queryKey: ["allTags", project_id, "documents"] });
          },
        },
      );
    }
    resetChanges();
  }

  useEffect(() => {
    if (document) {
      setLocalItem(document);
    } else {
      setLocalItem({
        ...DefaultDocument,
        project_id: project_id as string,
        template: drawer.exceptions?.createTemplate || false,
      });
    }
  }, [document]);

  return (
    <div className="flex h-full flex-col gap-y-2">
      <h2 className="text-center text-2xl">
        {document ? (
          `Edit ${document.title} ${document.template ? "[TEMPLATE]" : ""}`
        ) : (
          <div className="flex items-center">
            Create New Document
            <Icon fontSize={36} icon="mdi:file" />
          </div>
        )}
      </h2>
      <div className="flex flex-col gap-y-2">
        <InputText
          autoFocus
          className="w-full"
          onChange={(e) => handleChange({ name: "title", value: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (document)
                updateDocumentMutation?.mutate({
                  id: document.id,
                  parent: localItem.parent,
                  title: localItem.title,
                });
            }
          }}
          value={localItem?.title || ""}
        />
        <div className="flex w-full flex-col items-center">
          {localItem?.image ? (
            <Image
              className="h-28 w-36 object-contain"
              imageClassName="object-fit"
              preview
              src={`${baseURLS.baseServer}${getURLS.getSingleImage}${project_id}/${localItem?.image}`}
            />
          ) : null}
          <Dropdown
            className="w-full"
            itemTemplate={ImageDropdownItem}
            onChange={(e) => handleChange({ name: "image", value: e.value === "None" ? undefined : e.value })}
            options={["None", ...(images || [])] || []}
            placeholder="Select map"
            value={localItem?.image}
            valueTemplate={ImageDropdownValue({ image: localItem?.image })}
          />
        </div>
        {!localItem?.template && (
          <div className="">
            <Dropdown
              className="w-full"
              filter
              onChange={(e) => handleChange({ name: "parentId", value: e.target.value })}
              optionLabel="title"
              options={
                allDocuments
                  ? [
                      { id: null, title: "Root" },
                      ...(allDocuments as DocumentType[]).filter((d) => DropdownFilter(d, document)),
                    ]
                  : [{ id: null, title: "Root" }]
              }
              optionValue="id"
              placeholder="Document Folder"
              value={localItem?.parent?.id}
            />
          </div>
        )}
        <div className="">
          <Tags handleChange={handleChange} localItem={localItem} />
        </div>

        <div className="flex items-center justify-between">
          <span className="p-checkbox-label">Is Folder?</span>
          <Checkbox checked={localItem.folder} onChange={(e) => handleChange({ name: "folder", value: e.checked })} />
        </div>
        <div className="flex items-center justify-between">
          <span className="p-checkbox-label">Icon</span>
          <IconSelect setIcon={(newIcon: string) => handleChange({ name: "icon", value: newIcon })}>
            <Icon className="cursor-pointer" fontSize={20} icon={localItem.icon || "mdi:file"} />
          </IconSelect>
        </div>
      </div>

      <Button
        className="p-button-outlined p-button-success ml-auto"
        onClick={() => CreateUpdateDocument(localItem)}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
      <div className="mt-auto flex w-full">
        {document ? (
          <Button
            className=" p-button-outlined p-button-danger w-full"
            onClick={() => {
              if (document)
                deleteItem(
                  document.folder
                    ? "Are you sure you want to delete this folder? Deleting it will also delete all of its children!"
                    : "Are you sure you want to delete this document?",
                  () => {
                    deleteDocumentMutation?.mutate(document.id);
                    handleCloseDrawer(setDrawer, "right");
                  },
                  () => toaster("info", "Item not deleted."),
                );
            }}
            type="submit">
            {buttonLabelWithIcon("Delete", "mdi:trash")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
