import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Link, useParams } from "react-router-dom";

import { TreeSkeleton } from "../../components/Skeleton/Skeleton";
import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { EntityInstanceType, EntityType } from "../../types/ItemTypes/entityTypes";

function Header(title: string, entity_id: string) {
  return (
    <div className="flex flex-nowrap items-center justify-between">
      <h4 className="flex items-end justify-between border-b border-zinc-700 font-Lato">
        <span>{title}</span>
      </h4>
      <Link to={`../../entity_instances/create/${entity_id}`}>
        <Button
          className="p-button-outlined max-w-sm truncate"
          icon="pi pi-plus"
          iconPos="right"
          label={`Create new entity (${title})`}
        />
      </Link>
    </div>
  );
}
function LinkButton(rowData: EntityInstanceType, project_id: string) {
  const { id } = rowData;
  return (
    <Link to={`/project/${project_id}/entity_instances/${id}`}>
      <Button icon="pi pi-link" />
    </Link>
  );
}

export default function EntityInstancesList() {
  const { project_id, item_id } = useParams();
  const { data, isLoading, isFetching } = useGetItem<EntityType>(item_id as string, "entities", { staleTime: 5 * 60 * 1000 });
  const { data: e } = useGetAllItems<EntityInstanceType>(data?.id as string, "entityinstances", { enabled: !!data?.id });
  if (isLoading)
    return (
      <div className="p-4">
        <TreeSkeleton count={10} />;
      </div>
    );
  return (
    <div className="h-full p-4">
      <DataTable header={Header(data?.title as string, item_id as string)} loading={isFetching} value={e}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        {data?.fields.map((field) => {
          if (
            field.type === "text" ||
            field.type === "textarea" ||
            field.type === "number" ||
            field.type === "single_option" ||
            field.type === "multiple_options"
          )
            return (
              <Column
                key={field.id}
                body={(rowData: EntityInstanceType) => {
                  const t = rowData.field_values.find((fv) => fv.field_id === field.id)?.value;
                  return t;
                }}
                header={field.title}
              />
            );
        })}
        <Column body={(rowData) => LinkButton(rowData, project_id as string)} />
      </DataTable>
    </div>
  );
}
