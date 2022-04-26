import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useCreateDocument,
  useGetTemplates,
} from "../../../../utils/customHooks";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import { v4 as uuid } from "uuid";
import { InputText } from "primereact/inputtext";
import { Document } from "../../../../custom-types";
type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function DocFromTempDialog({ visible, setVisible }: Props) {
  const { project_id } = useParams();
  const [value, setValue] = useState();
  const [customName, setCustomName] = useState<string | undefined>();
  const templates = useGetTemplates(project_id as string);
  const createDocumentMutation = useCreateDocument(project_id as string);

  function createDocumentFromTemplate(
    template: Document,
    customName: string | undefined
  ) {
    let id = uuid();
    createDocumentMutation.mutate({
      ...template,
      id,
      parent: null,
      title: customName || template.title,
    });
  }
  return (
    <Dialog
      className="w-3 Merriweather"
      header={"Create Document From Template"}
      visible={visible}
      onHide={() => {
        setValue(undefined);
        setVisible(false);
      }}
    >
      <h3 className="Lato">Select a template</h3>
      <div className="field-radiobutton flex flex-wrap align-items-start h-5rem overflow-y-auto">
        {templates &&
          templates.map((template) => (
            <div className="w-6 my-1 Lato flex align-items-center">
              <RadioButton
                className="mr-2"
                value={template.id}
                onChange={(e) => setValue(e.value)}
                checked={value === template.id}
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
              let template = templates.find((temp) => temp.id === value);
              if (template) {
                createDocumentFromTemplate(template, customName);
              }
            }
          }}
        />
      </div>
      <div className="w-full flex justify-content-end">
        <Button
          className="p-button-outlined"
          label="Create From Template"
          icon="pi pi-copy"
          iconPos="right"
          onClick={() => {
            let template = templates.find((temp) => temp.id === value);
            if (template) {
              createDocumentFromTemplate(template, customName);
            }
          }}
        />
      </div>
    </Dialog>
  );
}
