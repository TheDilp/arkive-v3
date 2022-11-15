import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useCreateMutation,
  useDeleteMutation,
  useGetAllDocuments,
  useUpdateMutation,
} from "../../../CRUD/DocumentCRUD";
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

  const { data: allDocuments } = useGetAllDocuments(project_id as string);
  const document = useGetItem(project_id as string, drawer?.id, "documents");
  const createDocumentMutation = useCreateMutation("documents");
  const updateDocumentMutation = useUpdateMutation("documents");
  const deleteDocumentMutation = useDeleteMutation("documents");
  function CreateUpdateDocument(newData: DocumentCreateType) {
    if (document) {
      updateDocumentMutation?.mutate(
        {
          id: document.id,
          ...newData,
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
  function DropdownFilter(doc: DocumentType) {
    if (!doc.folder || (document && doc.id === document.id)) return false;
    return true;
  }
  return (
    <div className="flex flex-col my-2 gap-y-8">
      <h2 className="text-2xl text-center">
        {document ? `Edit ${document.title} ${document.template ? "[TEMPLATE]" : ""}` : "Create New Document"}
      </h2>
      <div className="flex flex-col gap-y-2">
        <InputText
          className="w-full"
          value={localItem?.title || ""}
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
          autoFocus={true}
        />
        {!localItem?.template && (
          <div className="my-2">
            <Dropdown
              className="w-full"
              placeholder="Document Folder"
              optionLabel="title"
              optionValue="id"
              value={localItem?.parent}
              filter
              onChange={(e) => {
                setLocalItem((prev) => ({
                  ...prev,
                  parent: e.value,
                }));
              }}
              options={
                allDocuments
                  ? [{ id: null, title: "Root" }, ...allDocuments.filter(DropdownFilter)]
                  : [{ id: null, title: "Root" }]
              }
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <label htmlFor="cb1" className="p-checkbox-label">
            Is Folder?
          </label>
          <Checkbox
            onChange={(e) =>
              setLocalItem((prev) => ({
                ...prev,
                folder: e.checked,
              }))
            }
            icon={<Icon icon="mdi:check" className="pointer-events-none" />}
            checked={localItem.folder}
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="cb1" className="p-checkbox-label">
            Icon
          </label>
          <IconSelect setIcon={(newIcon: string) => setLocalItem((prev) => ({ ...prev, icon: newIcon }))}>
            <Icon className="cursor-pointer" icon={localItem.icon || "mdi:file"} fontSize={20} />
          </IconSelect>
        </div>
      </div>

      <div className="w-full flex justify-between">
        {document ? (
          <Button
            className=" p-button-outlined p-button-danger"
            type="submit"
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
            }}>
            {buttonLabelWithIcon("Delete", "mdi:trash")}
          </Button>
        ) : null}
        <Button
          className="ml-auto p-button-outlined p-button-success"
          type="submit"
          onClick={() => {
            if (allDocuments?.some((item) => item.parent === localItem.id)) {
              toaster("error", "Cannot convert to file if folder contains files.");
              return;
            }

            CreateUpdateDocument(localItem);
          }}>
          {buttonLabelWithIcon("Save", "mdi:content-save")}
        </Button>
      </div>
    </div>
  );
}
