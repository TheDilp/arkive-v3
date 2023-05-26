import { useUser } from "@clerk/clerk-react";
import {
  QueryClient,
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  UseMutateAsyncFunction,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableSelection } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { MutableRefObject, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useAssignRole, useGetProjectMembers, useGetProjectRoles, useRevokeRole } from "../../CRUD/ProjectCRUD";
import { baseURLS } from "../../types/CRUDenums";
import { UserType } from "../../types/userTypes";
import { FetchFunction } from "../../utils/CRUD/CRUDFetch";
import { toaster } from "../../utils/toast";

function Header(
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<UserType[], unknown>>,
) {
  const [addNew, setAddNew] = useState(false);
  const [email, setEmail] = useState("");
  const { project_id } = useParams();
  return (
    <div className="flex items-center gap-2">
      <Button
        className="p-button-outlined p-button-rounded"
        icon="pi pi-user-plus"
        onClick={() => setAddNew((prev) => !prev)}
      />
      {addNew ? <InputText onChange={(e) => setEmail(e.target.value)} placeholder="Email" /> : null}
      {addNew ? (
        <Button
          className="p-button-outlined"
          icon="pi pi-send"
          label="Send invite"
          onClick={async () => {
            await FetchFunction({
              url: `${baseURLS.baseServer}addtoproject`,
              method: "POST",
              body: JSON.stringify({ email, project_id }),
            });
            await refetch();
            toaster("info", "User added to project.");
            setEmail("");
          }}
        />
      ) : null}
      <h3 className="mx-auto font-Merriweather text-xl text-zinc-100">Members & Permissions</h3>
    </div>
  );
}
type RoleChangeFn = UseMutateAsyncFunction<
  any,
  unknown,
  {
    user_id: string;
    role_id: string;
  },
  unknown
>;
function RoleBody(
  rowData: UserType,
  roles: { label: string; value: string }[] | undefined,
  assignRole: RoleChangeFn,
  revokeRole: RoleChangeFn,
  queryClient: QueryClient,
) {
  const role_id = rowData?.roles?.[0]?.id;
  const { id: user_id } = rowData;
  return (
    <Dropdown
      className="w-full"
      clearIcon="pi pi-times"
      onChange={async (e) => {
        if (e.value) await assignRole({ user_id, role_id: e.value });
        else await revokeRole({ user_id, role_id });
        await queryClient.refetchQueries({ queryKey: ["projectMembers"] });
      }}
      options={roles || []}
      showClear
      value={role_id}
    />
  );
}

export default function MemberSettings() {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const tableRef = useRef() as MutableRefObject<DataTable<any[]>>;
  const [selected, setSelected] = useState<DataTableSelection<any[]>>([]);
  const { user } = useUser();
  const { mutateAsync: assignRole } = useAssignRole();
  const { mutateAsync: revokeRole } = useRevokeRole();
  const {
    data: members,
    isFetching: isFetchingMembers,
    refetch,
  } = useGetProjectMembers(project_id as string, {
    enabled: !!user,
  });

  const { data: roles } = useGetProjectRoles(project_id as string, {
    staleTime: 5 * 60 * 1000,
  });
  const mappedRoles = roles?.map((role) => ({ value: role.id, label: role.title }));

  if (!members) return null;
  return (
    <div className="h-[95vh] w-full overflow-hidden p-4">
      <DataTable
        ref={tableRef}
        className="h-full w-full"
        dataKey="id"
        editMode="cell"
        header={() => Header(refetch)}
        loading={isFetchingMembers}
        onSelectionChange={(e) => setSelected(e.value)}
        paginator
        removableSort
        responsiveLayout="scroll"
        rows={10}
        scrollHeight="80%"
        selection={selected}
        selectionMode="checkbox"
        showGridlines
        size="small"
        sortMode="multiple"
        value={(members as any) || []}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column className="w-3/4 truncate" field="nickname" filter header="Title" />
        <Column
          body={(rowData) => RoleBody(rowData, mappedRoles, assignRole, revokeRole, queryClient)}
          className="max-w-[10rem] truncate"
          field="roles"
          filter
          header="Role"
        />
      </DataTable>
    </div>
  );
}
