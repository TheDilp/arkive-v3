import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Chips } from "primereact/chips";
import { Dropdown } from "primereact/dropdown";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem, useDeleteItem, useGetAllImages, useUpdateItem } from "../../../CRUD/ItemsCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { baseURLS } from "../../../types/CRUDenums";
import { DocumentCreateType, DocumentType } from "../../../types/ItemTypes/documentTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { createUpdateItem } from "../../../utils/CRUD/CRUDFunctions";
import { DefaultDocument } from "../../../utils/DefaultValues/DocumentDefaults";
import { DropdownFilter } from "../../../utils/filters";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { virtualScrollerSettings } from "../../../utils/uiUtils";
import { ImageDropdownItem } from "../../Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../../Dropdown/ImageDropdownValue";
import { IconSelect } from "../../IconSelect/IconSelect";
import Tags from "../../Tags/Tags";
import { handleCloseDrawer } from "../Drawer";

export default function DrawerDocumentContent() {
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);

  const queryClient = useQueryClient();
  const allDocuments = queryClient.getQueryData<DocumentType[]>(["allItems", project_id, "documents"]);
  const document = allDocuments?.find((doc) => doc.id === drawer.id);
  const { data: images } = useGetAllImages(project_id as string);

  const createDocumentMutation = useCreateItem<DocumentType>("documents");
  const updateDocumentMutation = useUpdateItem<DocumentType>("documents", project_id as string);
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
          <div className="flex items-center">Create New Document</div>
        )}
      </h2>
      <div className="flex flex-col gap-y-2">
        <InputText
          autoFocus
          className="w-full"
          name="title"
          onChange={(e) => handleChange(e.target)}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && localItem.title) {
              await createUpdateItem<DocumentType>(
                document,
                localItem,
                changedData,
                DefaultDocument,
                allDocuments,
                resetChanges,
                createDocumentMutation.mutateAsync,
                updateDocumentMutation.mutateAsync,
                setDrawer,
              );
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
              src={`${baseURLS.baseImageHost}${localItem?.image}`}
            />
          ) : null}
          <Dropdown
            className="w-full"
            filter
            itemTemplate={ImageDropdownItem}
            name="image"
            onChange={(e) => handleChange({ name: "image", value: e.value === "None" ? undefined : e.value })}
            options={["None", ...(images || [])] || []}
            placeholder="Select map"
            value={localItem?.image}
            valueTemplate={ImageDropdownValue({ image: localItem?.image })}
            virtualScrollerOptions={virtualScrollerSettings}
          />
        </div>
        {!localItem?.template && (
          <div className="">
            <Dropdown
              className="w-full"
              filter
              name="parentId"
              onChange={(e) => handleChange(e.target)}
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
              value={localItem?.parentId}
            />
          </div>
        )}
        <div className="w-full">
          <Chips
            allowDuplicate={false}
            className="alterNamesChips"
            max={5}
            name="alter_names"
            onChange={(e) => handleChange(e.target)}
            placeholder="Alternative names (5 max)"
            value={localItem?.alter_names}
          />
        </div>

        <div className="">
          <Tags handleChange={handleChange} localItem={localItem} type="documents" />
        </div>

        <div className="flex items-center justify-between">
          <span className="p-checkbox-label">Is Folder?</span>
          <Checkbox checked={localItem.folder} onChange={(e) => handleChange({ name: "folder", value: e.checked })} />
        </div>
        {!localItem?.template ? (
          <div className="flex items-center justify-between">
            <span className="p-checkbox-label">Is Public?</span>
            <Checkbox
              checked={localItem?.isPublic}
              name="isPublic"
              onChange={(e) => handleChange({ name: e.target.name, value: e.target.checked })}
              tooltip="If checked, anyone can access the content via a public page"
              tooltipOptions={{ position: "left", showDelay: 500 }}
            />
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <span className="p-checkbox-label">Icon</span>
          <IconSelect setIcon={(newIcon: string) => handleChange({ name: "icon", value: newIcon })}>
            <Icon className="cursor-pointer" fontSize={20} icon={localItem.icon || "mdi:file"} />
          </IconSelect>
        </div>
      </div>

      <Button
        className="p-button-outlined p-button-success ml-auto"
        disabled={!localItem.title}
        loading={createDocumentMutation.isLoading || updateDocumentMutation.isLoading}
        onClick={async () => {
          await createUpdateItem<DocumentType>(
            document,
            localItem,
            changedData,
            DefaultDocument,
            allDocuments,
            resetChanges,
            createDocumentMutation.mutateAsync,
            updateDocumentMutation.mutateAsync,
            setDrawer,
          );
        }}
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
