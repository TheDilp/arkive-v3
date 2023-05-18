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
  field: { title: string; type: string; options: string[] };
  index: number;
  onChange: Dispatch<
    SetStateAction<
      {
        id: string;
        title: string;
        type: string;
        options: string[];
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
      {field.type === "single_option" || field.type === "multiple_options" ? (
        <>
          <div className="col-span-2">
            <h4 className="flex items-end justify-between border-b border-zinc-700 font-Lato">
              <span>Options</span>
              <Button
                className="p-button-text"
                icon="pi pi-plus"
                onClick={() =>
                  onChange((prev) => prev.map((f, i) => (i === index ? { ...f, options: [...f.options, "New option"] } : f)))
                }
                size="small"
              />
            </h4>
          </div>
          <div className="col-span-2 flex flex-col gap-y-2">
            {field.options.map((option, i) => (
              <div key={i.toFixed()} className="flex flex-nowrap gap-x-2">
                <InputText
                  className="p-inputtext-sm w-full"
                  onChange={(e) => {
                    const temp = [...field.options];
                    temp[i] = e.target.value;
                    onChange((prev) => prev.map((f, idx) => (idx === index ? { ...f, options: temp } : f)));
                  }}
                  value={option}
                />
                <div className="col-span-1">
                  <Button className="p-button-text p-button-danger " icon="pi pi-trash" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}

export default function EntityCreate() {
  const { project_id } = useParams();
  const [entity, setEntity] = useState({ title: "", description: "" });
  const [fields, setFields] = useState<{ id: string; title: string; type: string; options: string[] }[]>([]);

  const { mutate } = useCreateItem<{
    title: string;
    description: string;
    project_id: string;
    fields: { title: string; type: string }[];
  }>("entities");

  return (
    <div className="flex h-full w-full justify-center p-4">
      <div className="flex h-full w-full max-w-3xl flex-col gap-y-4">
        <div className="w-full">
          <DrawerSectionTitle title="Entity title" />
          <InputText
            className="w-full"
            onChange={(e) => setEntity((prev) => ({ ...prev, title: e.target.value.trim() }))}
            placeholder="Must be unique for this project"
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
        <div className="grid max-h-96 grid-cols-2 gap-4 overflow-y-auto px-4">
          <div className="sticky top-0 z-10 col-span-2 flex items-center justify-between border-b border-zinc-700 bg-[#121212]">
            <h2 className="font-Lato text-2xl">Fields</h2>
            <Button
              className="p-button-text p-button-rounded"
              icon="pi pi-plus"
              onClick={() => setFields((prev) => [...prev, { id: crypto.randomUUID(), title: "", type: "", options: [] }])}
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
