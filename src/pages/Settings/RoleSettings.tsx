import { useSetAtom } from "jotai";
import { Button } from "primereact/button";
import { Column, ColumnBodyOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { useParams } from "react-router-dom";

import { useGetProjectRoles } from "../../CRUD/ProjectCRUD";
import { RolePermissionsType } from "../../types/generalTypes";
import { RoleType } from "../../types/ItemTypes/projectTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { RoleItems } from "../../utils/DefaultValues/ProjectDefaults";

function Header() {
  const setDrawer = useSetAtom(DrawerAtom);
  return (
    <div className="flex items-center gap-2">
      <Button
        className="p-button-outlined"
        icon="pi pi-key"
        label="Create new role"
        onClick={() => {
          setDrawer({ ...DefaultDrawer, show: true, type: "roles" });
        }}
      />
    </div>
  );
}
function EditRoleButton(rowData: RoleType) {
  const setDrawer = useSetAtom(DrawerAtom);
  const { id } = rowData;
  return (
    <Button
      icon="pi pi-pencil"
      onClick={() => setDrawer({ ...DefaultDrawer, id, data: rowData, type: "roles", show: true, position: "right" })}
    />
  );
}
function getPermission(rowData: RoleType, name: string) {
  const editPermission = `edit_${name}`;
  if (rowData[editPermission as RolePermissionsType]) return "Edit";
  const viewPermission = `view_${name}`;
  if (rowData[viewPermission as RolePermissionsType]) return "View";
  return "None";
}

function getPermissionColor(permission: "Edit" | "View" | "None") {
  if (permission === "Edit") return "success";
  if (permission === "View") return "warning";
  if (permission === "None") return "info";
  return undefined;
}

function PermissionBody(rowData: any, options: ColumnBodyOptions) {
  const { field } = options;
  const permission = getPermission(rowData, field);
  return <Tag severity={getPermissionColor(permission)} value={permission} />;
}

export default function RoleSettings() {
  const { project_id } = useParams();
  const { data: roles, isFetching } = useGetProjectRoles(project_id as string);
  return (
    <div className="h-[95vh] w-full overflow-hidden p-4">
      <DataTable header={Header} loading={isFetching} value={roles}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column className="max-w-[20rem] truncate" field="title" filter header="Title" />
        <Column className="max-w-[10rem] truncate" field="description" header="Description" />
        {RoleItems.map((item) => (
          <Column
            key={item}
            body={(rowData, options) => PermissionBody(rowData, options)}
            className="max-w-[12rem] truncate"
            field={item.toLowerCase()}
            header={item.replaceAll("_", " ")}
          />
        ))}
        <Column body={(rowData) => EditRoleButton(rowData)} />
      </DataTable>
    </div>
  );
}
