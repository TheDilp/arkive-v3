import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useState } from "react";

import { FieldType } from "../../types/formTypes";

function isNewFieldDisabled(newField: FieldType) {
  if (Object.values(newField).some((value) => value === null)) {
    return true;
  }
  return false;
}

function getFieldClassSize(size: number) {
  if (size === 1) return "col-span-1";
  if (size === 2) return "col-span-2";
  if (size === 3) return "col-span-3";
  if (size === 4) return "col-span-4";
  if (size === 5) return "col-span-5";
  if (size === 6) return "col-span-6";
  return "";
}

export default function FormView() {
  const [fields, setFields] = useState<FieldType[]>([
    {
      id: "1",
      title: "Strength",
      type: "number",
      size: 1,
    },
    {
      id: "2",
      title: "Dexterity",
      type: "number",
      size: 1,
    },
    {
      id: "3",
      title: "Constitution",
      type: "text",
      size: 1,
    },
    {
      id: "4",
      title: "Intelligence",
      type: "number",
      size: 1,
    },
    {
      id: "5",
      title: "Wisdom",
      type: "number",
      size: 1,
    },
    {
      id: "6",
      title: "Charisma",
      type: "number",
      size: 1,
    },
    {
      id: "7",
      title: "Character appearance",
      type: "textarea",
      size: 3,
    },
    {
      id: "8",
      title: "Character backstory",
      type: "textarea",
      size: 3,
    },
  ]);
  const [newField, setNewField] = useState<FieldType>({
    id: crypto.randomUUID(),
    title: null,
    type: null,
    size: null,
  });
  return (
    <div className="flex flex-col gap-y-6 p-8">
      <h2 className="font-Lato text-3xl font-semibold">Character sheet</h2>
      <div className="flex w-full gap-x-2">
        <InputText
          onChange={(e) => setNewField((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Field Name"
          value={newField.title || ""}
        />
        <Dropdown
          onChange={(e) => setNewField((prev) => ({ ...prev, type: e.value }))}
          options={[
            { label: "Text Input", value: "text" },
            { label: "Number Input", value: "number" },
          ]}
          placeholder="Field type"
          value={newField.type}
        />
        <Dropdown
          onChange={(e) => setNewField((prev) => ({ ...prev, size: e.value }))}
          options={[
            { label: "1", value: 1 },
            { label: "2", value: 2 },
            { label: "3", value: 3 },
            { label: "4", value: 4 },
            { label: "5", value: 5 },
            { label: "6", value: 6 },
          ]}
          placeholder="Field size"
          value={newField.size}
        />
        <Button
          className="p-button-outlined"
          disabled={isNewFieldDisabled(newField)}
          icon="pi pi-plus"
          iconPos="right"
          label="Add field"
          onClick={() => {
            setFields((prev) => [...prev, newField]);
            setNewField({ title: null, id: crypto.randomUUID(), type: null, size: null });
          }}
        />
      </div>
      <hr className="border-zinc-800" />

      <div className="grid grid-cols-6 gap-x-4 gap-y-6">
        {fields.map((field) => (
          <div key={field.id} className={getFieldClassSize(field.size || 6)}>
            <span className="block">{field.title}</span>
            {field.type === "text" ? <InputText className="w-full" /> : null}
            {field.type === "number" ? <InputNumber className="w-full" /> : null}
            {field.type === "textarea" ? <InputTextarea className="w-full" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
