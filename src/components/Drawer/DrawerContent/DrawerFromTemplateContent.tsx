import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";
import { useCreateItem, useGetAllItems } from "../../../CRUD/ItemsCRUD";
import { DocumentType } from "../../../types/documentTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { buttonLabelWithIcon } from "../../../utils/transform";

export default function DrawerFromTemplateContent() {
  const { project_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const { data: allDocuments } = useGetAllItems(project_id as string, "documents");
  const createDocumentMutation = useCreateItem("documents");

  function DropdownFilter(doc: DocumentType) {
    if (doc.template) return true;
    if (!doc.folder) return false;
    return false;
  }
  return (
    <div className="my-2 flex flex-col gap-y-8">
      <h2 className="text-center text-2xl">{document ? `Edit ${document.title}` : "Create New Document"}</h2>
      <div className="flex flex-col gap-y-2">
        <div className="my-2">
          <Dropdown
            className="w-full"
            placeholder="Select Template"
            optionLabel="title"
            optionValue="id"
            value={selectedTemplate}
            filter
            onChange={(e) => {
              setSelectedTemplate(e.value as string);
            }}
            options={allDocuments ? [...(allDocuments as DocumentType[]).filter(DropdownFilter)] : []}
          />
        </div>

        <div className="flex w-full justify-between">
          <Button
            className="p-button-outlined p-button-success ml-auto"
            type="submit"
            onClick={() => {
              const template = allDocuments?.find((doc) => doc.id === selectedTemplate);
              createDocumentMutation?.mutate({
                ...template,
                id: v4(),
                project_id: project_id as string,
                template: false,
              });
            }}>
            {buttonLabelWithIcon("Save", "mdi:content-save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
