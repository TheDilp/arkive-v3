import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useParams } from "react-router-dom";

import { useGetProjectRoles } from "../../CRUD/ProjectCRUD";

function Header() {
  return (
    <div className="flex items-center gap-2">
      <Button className="p-button-outlined" icon="pi pi-key" label="Create new role" onClick={() => {}} />
    </div>
  );
}

export default function RoleSettings() {
  const { project_id } = useParams();
  const { data: roles, isFetching } = useGetProjectRoles(project_id as string);
  return (
    <div className="p-4">
      <DataTable header={Header} loading={isFetching} value={roles as any}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column className="max-w-[15rem] truncate" field="nickname" filter header="Title" />
      </DataTable>
    </div>
  );
}
