import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { DocumentCreateProps, DocumentProps } from "../../../../custom-types";
import {
  useCreateDocument,
  useGetDocuments,
  useGetTemplates,
} from "../../../../utils/customHooks";
type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function DocumentFromTempDialog({ visible, setVisible }: Props) {
  const { project_id } = useParams();
  const [selectedTemplate, setSelectedTemplate] =
    useState<DocumentProps | null>(null);
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [customName, setCustomName] = useState<string | undefined>();
  const { data: documents } = useGetDocuments(project_id as string);
  const createDocumentMutation = useCreateDocument(project_id as string);
  function createDocumentFromTemplate(
    template: DocumentProps,
    parent: string | null,
    customName: string | undefined
  ) {
    let id = uuid();
    createDocumentMutation.mutate({
      ...template,
      template: false,
      folder: false,
      id,
      title: customName || template.title,
      parent,
    });
  }
  return (
    <Dialog
      className="w-3"
      header={"Create Document From Template"}
      visible={visible}
      onHide={() => {
        setSelectedTemplate(null);
        setVisible(false);
      }}
    >
      <h3 className="Lato">Select a template</h3>
      <div className="field-radiobutton flex flex-wrap align-items-start h-5rem overflow-y-auto">
        {documents &&
          documents
            .filter((doc) => doc.template)
            .map((template) => (
              <div
                className="w-6 my-1 Lato flex align-items-center"
                key={template.id}
              >
                <RadioButton
                  className="mr-2"
                  value={template.id}
                  onChange={(e) => setSelectedTemplate(template)}
                  checked={selectedTemplate?.id === template.id}
                />
                {template.title}
              </div>
            ))}
      </div>
      <div className="w-full my-2">
        <InputText
          placeholder="Custom Document Name"
          className="w-full"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (selectedTemplate) {
                createDocumentFromTemplate(
                  selectedTemplate,
                  selectedParent,
                  customName
                );
              }
            }
          }}
        />
      </div>
      <div className="w-full my-2">
        <Dropdown
          className="w-full"
          placeholder="Document Folder"
          optionLabel="title"
          optionValue="id"
          value={selectedParent}
          filter
          onChange={(e) => setSelectedParent(e.value)}
          options={
            documents
              ? [
                  { title: "Root", id: null },
                  ...documents.filter((doc) => {
                    return doc.folder && !doc.template;
                  }),
                ]
              : []
          }
        />
      </div>
      <div className="w-full flex justify-content-end">
        <Button
          className="p-button-outlined"
          label="Create From Template"
          icon="pi pi-copy"
          iconPos="right"
          onClick={() => {
            if (selectedTemplate) {
              createDocumentFromTemplate(
                selectedTemplate,
                selectedParent,
                customName
              );
            }
          }}
        />
      </div>
    </Dialog>
  );
}
