import { useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem } from "../../../CRUD/ItemsCRUD";
import { DocumentType } from "../../../types/ItemTypes/documentTypes";
import { buttonLabelWithIcon } from "../../../utils/transform";

export default function DrawerFromTemplateContent() {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const allDocuments: DocumentType[] | undefined = queryClient.getQueryData(["allItems", project_id, "documents"]);
  const createDocumentMutation = useCreateItem<DocumentType>("documents");

  function DropdownFilter(doc: DocumentType) {
    if (doc.template) return true;
    if (!doc.folder) return false;
    return false;
  }
  return (
    <div className="my-2 flex flex-col gap-y-8">
      <h2 className="text-center text-2xl">Create New Document From Template</h2>
      <div className="flex flex-col gap-y-2">
        <div className="my-2">
          <Dropdown
            className="w-full"
            filter
            onChange={(e) => {
              setSelectedTemplate(e.value as string);
            }}
            optionLabel="title"
            options={allDocuments ? [...(allDocuments as DocumentType[]).filter(DropdownFilter)] : []}
            optionValue="id"
            placeholder="Select Template"
            value={selectedTemplate}
          />
        </div>

        <div className="flex w-full justify-between">
          <Button
            className="p-button-outlined p-button-success w-full"
            loading={createDocumentMutation.isLoading}
            onClick={() => {
              const template = allDocuments?.find((doc) => doc.id === selectedTemplate);
              createDocumentMutation?.mutate({
                ...template,
                id: crypto.randomUUID(),
                project_id: project_id as string,
                template: false,
              });
            }}
            type="submit">
            {buttonLabelWithIcon("Save", "mdi:content-save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
