import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dispatch, SetStateAction, useState } from "react";
import { useParams } from "react-router-dom";

import DrawerSectionTitle from "../../components/Drawer/DrawerSectionTitle";
import { useCreateItem } from "../../CRUD/ItemsCRUD";
import { EntityFieldTypes } from "../../utils/DefaultValues/EntityDefaults";

type FieldProps = {
  field: { title: string; type: string };
  index: number;
  onChange: Dispatch<
    SetStateAction<
      {
        id: string;
        title: string;
        type: string;
      }[]
    >
  >;
};

function EntityField({ field, index, onChange }: FieldProps) {
  return (
    <>
      <div className="col-span-1 flex flex-col">
        <DrawerSectionTitle title="Field name" />
        <InputText
          onChange={(e) => onChange((prev) => prev.map((f, i) => (i === index ? { ...f, title: e.target.value } : f)))}
          placeholder="E.g. First name"
          value={field.title}
        />
      </div>
      <div className="col-span-1 flex flex-col">
        <DrawerSectionTitle title="Field type" />
        <Dropdown
          className="w-full"
          onChange={(e) => onChange((prev) => prev.map((f, i) => (i === index ? { ...f, type: e.value } : f)))}
          options={EntityFieldTypes}
          value={field.type}
        />
      </div>
    </>
  );
}

export default function EntityCreate() {
  const { project_id } = useParams();
  const [entity, setEntity] = useState({ title: "", description: "" });
  const [fields, setFields] = useState<{ id: string; title: string; type: string }[]>([]);

  const { mutate } = useCreateItem<{
    title: string;
    description: string;
    project_id: string;
    fields: { title: string; type: string }[];
  }>("entities");

  return (
    <div className="flex h-full w-full justify-center">
      <div className="flex h-full w-full max-w-2xl flex-col gap-y-4 p-4">
        <div className="w-full">
          <DrawerSectionTitle title="Entity title" />
          <InputText
            className="w-full"
            onChange={(e) => setEntity((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Entity title (e.g. Characters)"
          />
        </div>
        <div className="w-full">
          <DrawerSectionTitle title="Entity description (optional)" />
          <InputTextarea
            className="w-full"
            onChange={(e) => setEntity((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Entity description (optional)"
          />
        </div>
        <div className="grid max-h-96 grid-cols-2 gap-4 overflow-y-auto">
          <div className="col-span-2 flex items-center justify-between">
            <h2 className="font-Lato text-xl">Fields</h2>
            <Button
              className="p-button-text p-button-rounded"
              icon="pi pi-plus"
              onClick={() => setFields((prev) => [...prev, { id: crypto.randomUUID(), title: "", type: "" }])}
              tooltip="Add new field"
            />
          </div>
          {fields.map((field, index) => (
            <EntityField key={field.id} field={field} index={index} onChange={setFields} />
          ))}
        </div>
        <Button
          className="p-button-success p-button-outlined"
          disabled={!fields.length || !entity.title}
          label="Create"
          onClick={() => mutate({ title: entity.title, description: entity.description, project_id, fields })}
        />
      </div>
    </div>
  );
}
