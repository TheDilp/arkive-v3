import { Button } from "primereact/button";
import {
  DefaultDocumentType,
  DocumentCreateType,
  DocumentType,
} from "../../../types/documentTypes";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { recursiveDescendantFilter } from "../../../utils/recursive";
import { useState } from "react";
import {
  useCreateMutation,
  useGetAllDocuments,
  useUpdateMutation,
} from "../../../CRUD/DocumentCRUD";
import { useGetItem } from "../../../hooks/getItemHook";
import { useParams } from "react-router-dom";
import { useAtom } from "jotai";
import { DrawerAtom } from "../../../utils/atoms";
import { DefaultDocument } from "../../../utils/DefaultValues/DocumentDefaults";
import { buttonLabelWithIcon } from "../../../utils/transform";
export default function DrawerDocumentContent() {
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);

  const { data: allDocuments } = useGetAllDocuments(project_id as string);
  const document = useGetItem(project_id as string, drawer?.id, "documents");
  const createDocumentMutation = useCreateMutation("documents");
  const updateDocumentMutation = useUpdateMutation("documents");

  function CreateUpdateDocument(newData: DocumentCreateType) {
    if (document)
      updateDocumentMutation?.mutate({
        id: document.id,
        parent: localItem.parent,
        title: localItem.title,
      });
    else
      createDocumentMutation?.mutate({
        ...DefaultDocument,
        ...newData,
      });
  }
  function DropdownFilter(
    doc: DocumentType,
    idx: number,
    array: DocumentType[],
  ) {
    if (!doc.folder || !document || doc.id === document.id) return false;
    return recursiveDescendantFilter(doc, idx, array, document.id);
  }

  // Use item if editing or use a blank document (default values) if not to create new one
  const [localItem, setLocalItem] = useState<DocumentType | DocumentCreateType>(
    document ?? DefaultDocument,
  );
  return (
    <div className="my-2">
      <InputText
        className="w-full"
        value={localItem?.title || ""}
        onChange={(e) =>
          setLocalItem((prev) => ({ ...prev, title: e.target.value }))
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
              setLocalItem((prev) => ({ ...prev, parent: e.value }));
            }}
            options={
              allDocuments
                ? allDocuments.filter(DropdownFilter)
                : [{ id: null, title: "Root" }]
            }
          />
        </div>
      )}
      <div className="w-full flex">
        <Button
          className="ml-auto p-button-outlined p-button-success"
          type="submit"
          onClick={() => CreateUpdateDocument(localItem)}>
          {buttonLabelWithIcon("Save", "mdi:content-save")}
        </Button>
      </div>
    </div>
  );
}
