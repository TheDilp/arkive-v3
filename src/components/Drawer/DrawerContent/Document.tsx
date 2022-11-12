import { Button } from "primereact/button";
import { DocumentType } from "../../../types/documentTypes";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { recursiveDescendantFilter } from "../../../utils/recursive";
import { useState } from "react";
import { useUpdateMutation } from "../../../CRUD/DocumentCRUD";

export default function Document({
  allItems,
  item,
}: {
  allItems: DocumentType[] | undefined;
  item: DocumentType;
}) {
  function DropdownFilter(
    doc: DocumentType,
    idx: number,
    array: DocumentType[],
  ) {
    if (!doc.folder || doc.id === item.id) return false;
    return recursiveDescendantFilter(doc, idx, array, item.id);
  }
  const updateDocumentMutation = useUpdateMutation("documents");
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
            updateDocumentMutation?.mutate({
              id: item.id,
              parent: localItem.parent,
              title: localItem.title,
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
                ? allItems.filter(DropdownFilter)
                : [{ id: null, title: "Root" }]
            }
          />
        </div>
      )}
      <div className="w-full flex">
        <Button
          className="ml-auto p-button-outlined p-button-success"
          label="Save"
          icon="pi pi-fw pi-save"
          iconPos="right"
          type="submit"
          onClick={() =>
            updateDocumentMutation?.mutate({
              id: item.id,
              parent: localItem.parent,
              title: localItem.title,
            })
          }
        />
      </div>
    </div>
  );
}
