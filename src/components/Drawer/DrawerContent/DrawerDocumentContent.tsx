import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem, useDeleteMutation, useGetAllItems, useUpdateItem } from "../../../CRUD/ItemsCRUD";
import { useGetItem } from "../../../hooks/getItemHook";
import { DocumentCreateType, DocumentType } from "../../../types/documentTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { deleteItem } from "../../../utils/Confirms/Confirm";
import { DefaultDocument } from "../../../utils/DefaultValues/DocumentDefaults";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { IconSelect } from "../../IconSelect/IconSelect";
import { handleCloseDrawer } from "../Drawer";

export default function DrawerDocumentContent() {
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);

  const { data: allDocuments } = useGetAllItems(project_id as string, "documents");
  const document = useGetItem(project_id as string, drawer?.id, "documents") as DocumentType;
  const createDocumentMutation = useCreateItem("documents");
  const updateDocumentMutation = useUpdateItem("documents");
  const deleteDocumentMutation = useDeleteMutation("documents", project_id as string);

  function CreateUpdateDocument(newData: DocumentCreateType) {
    if (document) {
      if (allDocuments?.some((item) => item.parent === newData.id) && !newData.folder) {
        toaster("warning", "Cannot convert to file if folder contains files.");
        return;
      }
      updateDocumentMutation?.mutate(
        {
          folder: newData.folder,
          icon: newData.icon,
          id: document.id,
          title: newData.title,
        },
        {
          onSuccess: () => toaster("success", "Your document was successfully updated."),
        },
      );
    } else {
      createDocumentMutation?.mutate({
        ...DefaultDocument,
        ...newData,
      });
    }
  }

  // Use item if editing or use a blank document (default values) if not to create new one
  const [localItem, setLocalItem] = useState<DocumentType | DocumentCreateType>(
    document ?? {
      ...DefaultDocument,
      project_id: project_id as string,
      template: drawer.exceptions?.createTemplate || false,
    },
  );

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

  function DropdownFilter(item: DocumentType) {
    if (!item.folder || (document && item.id === document.id)) return false;
    return true;
  }
  return (
    <div className="my-2 flex flex-col gap-y-8">
      <h2 className="text-center text-2xl">
        {document ? `Edit ${document.title} ${document.template ? "[TEMPLATE]" : ""}` : "Create New Document"}
      </h2>
      <div className="flex flex-col gap-y-2">
        <InputText
          autoFocus
          className="w-full"
          onChange={(e) =>
            setLocalItem((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
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
        {!localItem?.template && (
          <div className="my-2">
            <Dropdown
              className="w-full"
              filter
              onChange={(e) => {
                setLocalItem((prev) => ({
                  ...prev,
                  parent: e.value,
                }));
              }}
              optionLabel="title"
              options={
                allDocuments
                  ? [{ id: null, title: "Root" }, ...(allDocuments as DocumentType[]).filter(DropdownFilter)]
                  : [{ id: null, title: "Root" }]
              }
              optionValue="id"
              placeholder="Document Folder"
              value={localItem?.parent}
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="p-checkbox-label">Is Folder?</span>
          <Checkbox
            checked={localItem.folder}
            onChange={(e) =>
              setLocalItem((prev) => ({
                ...prev,
                folder: e.checked,
              }))
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="p-checkbox-label">Icon</span>
          <IconSelect setIcon={(newIcon: string) => setLocalItem((prev) => ({ ...prev, icon: newIcon }))}>
            <Icon className="cursor-pointer" fontSize={20} icon={localItem.icon || "mdi:file"} />
          </IconSelect>
        </div>
      </div>

      <div className="flex w-full justify-between">
        {document ? (
          <Button
            className=" p-button-outlined p-button-danger"
            onClick={() => {
              if (document)
                deleteItem(
                  document.folder
                    ? "Are you sure you want to delete this folder? Deleting it will also delete all of its children!"
                    : "Are you sure you want to delete this document?",
                  () => {
                    deleteDocumentMutation?.mutate(document.id);
                    handleCloseDrawer(setDrawer);
                  },
                  () => toaster("info", "Item not deleted."),
                );
            }}
            type="submit">
            {buttonLabelWithIcon("Delete", "mdi:trash")}
          </Button>
        ) : null}
        <Button
          className="p-button-outlined p-button-success ml-auto"
          onClick={() => CreateUpdateDocument(localItem)}
          type="submit">
          {buttonLabelWithIcon("Save", "mdi:content-save")}
        </Button>
      </div>
    </div>
  );
}
