import { useUser } from "@clerk/clerk-react";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableSelection } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { MutableRefObject, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useUpdatePermission } from "../../CRUD/OtherCRUD";
import { useGetProjectMembers } from "../../CRUD/ProjectCRUD";
import { baseURLS } from "../../types/CRUDenums";
import { ProjectType } from "../../types/ItemTypes/projectTypes";
import { ProjectAtom, UserAtom } from "../../utils/Atoms/atoms";
import { FetchFunction } from "../../utils/CRUD/CRUDFetch";
import { toaster } from "../../utils/toast";

function Header(
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<ProjectType, unknown>>,
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

export default function MemberSettings() {
  const { project_id } = useParams();
  const tableRef = useRef() as MutableRefObject<DataTable<any[]>>;
  const setProjectAtom = useSetAtom(ProjectAtom);
  const [selected, setSelected] = useState<DataTableSelection<any[]>>([]);
  const { user } = useUser();
  const UserData = useAtomValue(UserAtom);
  const { mutateAsync: updatePermission } = useUpdatePermission(project_id as string);
  const {
    data: members,
    isFetching: isFetchingMembers,
    refetch,
  } = useGetProjectMembers(project_id as string, {
    enabled: !!user,
    onSuccess: (data) => {
      setProjectAtom(data as ProjectType);
    },
  });
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
        value={members || []}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column className="max-w-[15rem] truncate" field="nickname" filter header="Title" />
        <Column className="max-w-[15rem] truncate" field="" filter header="Role" />
      </DataTable>
    </div>
  );
}
