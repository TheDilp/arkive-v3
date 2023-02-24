import { useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateItem } from "../../../CRUD/ItemsCRUD";
import { DocumentType } from "../../../types/ItemTypes/documentTypes";
import { buttonLabelWithIcon } from "../../../utils/transform";
import DrawerSection from "../DrawerSection";

function DropdownFilter(doc: DocumentType) {
  if (doc.template) return true;
  if (!doc.folder) return false;
  return false;
}

export default function DrawerFromTemplateContent() {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [title, setTitle] = useState("");
  const allDocuments: DocumentType[] | undefined = queryClient.getQueryData(["allItems", project_id, "documents"]);
  const createDocumentMutation = useCreateItem<DocumentType>("documents", true);

  return (
    <div className="my-2 flex flex-col gap-y-8">
      <h2 className="text-center text-2xl">Create New Document From Template</h2>
      <div className="flex flex-col gap-y-2">
        <DrawerSection title="Document title">
          <InputText onChange={(e) => setTitle(e.target.value)} placeholder="Document name" value={title} />
        </DrawerSection>
        <DrawerSection title="Select template">
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
        </DrawerSection>

        <div className="flex w-full justify-between">
          <Button
            className="p-button-outlined p-button-success w-full"
            loading={createDocumentMutation.isLoading}
            onClick={() => {
              const template = allDocuments?.find((doc) => doc.id === selectedTemplate);
              if (template) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { parent, ...rest } = template;
                createDocumentMutation?.mutate({
                  title,
                  project_id: project_id as string,
                  // @ts-ignore
                  template_id: template.id,
                });
              }
            }}
            type="submit">
            {buttonLabelWithIcon("Save", "mdi:content-save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
