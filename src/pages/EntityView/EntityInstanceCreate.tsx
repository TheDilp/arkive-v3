import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { useState } from "react";
import { useParams } from "react-router-dom";

import DrawerSectionTitle from "../../components/Drawer/DrawerSectionTitle";
import { useCreateItem } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { EntityType } from "../../types/ItemTypes/entityTypes";

export default function EntityInstanceCreate() {
  const { item_id } = useParams();
  const { data, isLoading, isFetching } = useGetItem<EntityType>(item_id as string, "entities", { staleTime: 5 * 60 * 1000 });

  const [entityInstanceData, setEntityInstanceData] = useState<{ [key: string]: string }>({});

  const { mutate } = useCreateItem<{ entity_id: string; field_values: { field_id: string; value: string }[] }>(
    "entityinstances",
  );

  return (
    <div className="flex w-full justify-center">
      <div className="grid w-full max-w-3xl grid-cols-2 gap-4 p-4">
        {data?.fields.map((field) => {
          if (field.type === "text")
            return (
              <div key={field.id} className="col-span-1">
                <DrawerSectionTitle title={field.title} />
                <InputText
                  className="w-full"
                  onChange={(e) => {
                    setEntityInstanceData((prev) => ({ ...prev, [field.id]: e.target.value }));
                  }}
                  value={entityInstanceData[field.id] || ""}
                />
              </div>
            );
          if (field.type === "number")
            return (
              <div key={field.id} className="col-span-1">
                <DrawerSectionTitle title={field.title} />
                <InputNumber
                  className="w-full"
                  onChange={(e) => {
                    setEntityInstanceData((prev) => ({ ...prev, [field.id]: e.value?.toFixed() as string }));
                  }}
                  value={parseInt(entityInstanceData[field.id] || "0", 10) || 0}
                />
              </div>
            );
          if (field.type === "multiple_options")
            return (
              <div key={field.id} className="col-span-1">
                <DrawerSectionTitle title={field.title} />
                <MultiSelect
                  className="w-full"
                  onChange={(e) => {
                    setEntityInstanceData((prev) => ({ ...prev, [field.id]: e.value }));
                  }}
                  options={field.options}
                  value={entityInstanceData[field.id]}
                />
              </div>
            );
        })}
        <div className="col-span-2 flex justify-end">
          <Button
            className="p-button-success p-button-outlined"
            icon="pi pi-save"
            iconPos="right"
            label="Create entity instance"
            onClick={() => {
              mutate({
                entity_id: item_id as string,
                field_values: Object.entries(entityInstanceData).map(([field_id, value]) => ({ field_id, value })),
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
