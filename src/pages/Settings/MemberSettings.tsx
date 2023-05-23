import { useUser } from "@clerk/clerk-react";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { Button } from "primereact/button";
import { Column, ColumnBodyOptions } from "primereact/column";
import { DataTable, DataTableSelection } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { MutableRefObject, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { PermissionEditor } from "../../components/Settings/Editors/PermissionEditor";
import { useUpdatePermission } from "../../CRUD/OtherCRUD";
import { useGetProjectMembers } from "../../CRUD/ProjectCRUD";
import { baseURLS } from "../../types/CRUDenums";
import { PermissionCategoriesType } from "../../types/generalTypes";
import { ProjectType } from "../../types/ItemTypes/projectTypes";
import { UserType } from "../../types/userTypes";
import { ProjectAtom, UserAtom } from "../../utils/Atoms/atoms";
import { FetchFunction } from "../../utils/CRUD/CRUDFetch";
import { toaster } from "../../utils/toast";

function PermissionBody(rowData: UserType, options: ColumnBodyOptions) {
  console.log(rowData);
  if (!rowData) return null;
  const { field } = options;
  const { permissions } = rowData;
  return <div>{permissions[0][field as PermissionCategoriesType]}</div>;
}

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
        severity="success"
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
    data: projectData,
    isFetching: isFetchingProject,
    refetch,
  } = useGetProjectMembers(project_id as string, {
    enabled: !!user,
    onSuccess: (data) => {
      setProjectAtom(data as ProjectType);
    },
  });

  console.log(projectData);
  if (!projectData) return null;
  return (
    <div className="h-[95vh] w-full overflow-hidden p-4">
      <DataTable
        ref={tableRef}
        className="h-full w-full"
        dataKey="id"
        editMode="cell"
        header={() => Header(refetch)}
        loading={isFetchingProject}
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
        value={projectData?.members || []}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column className="max-w-[15rem] truncate" field="member.nickname" filter header="Title" />
        <Column
          body={PermissionBody}
          className="max-w-[5rem] truncate"
          editor={(editor) => PermissionEditor(editor, UserData?.id as string, updatePermission, refetch)}
          field="documents"
          header="Documents"
        />
        <Column
          body={PermissionBody}
          className="max-w-[5rem] truncate"
          editor={(editor) => PermissionEditor(editor, UserData?.id as string, updatePermission, refetch)}
          field="maps"
          header="Maps"
        />
        <Column
          body={PermissionBody}
          className="max-w-[5rem] truncate"
          editor={(editor) => PermissionEditor(editor, UserData?.id as string, updatePermission, refetch)}
          field="boards"
          header="Graphs"
        />
        <Column
          body={PermissionBody}
          className="max-w-[5rem] truncate"
          editor={(editor) => PermissionEditor(editor, UserData?.id as string, updatePermission, refetch)}
          field="calendars"
          header="Calendars"
        />
        <Column
          body={PermissionBody}
          className="max-w-[5rem] truncate"
          editor={(editor) => PermissionEditor(editor, UserData?.id as string, updatePermission, refetch)}
          field="timelines"
          header="Timelines"
        />
        <Column
          body={PermissionBody}
          className="max-w-[5rem] truncate"
          editor={(editor) => PermissionEditor(editor, UserData?.id as string, updatePermission, refetch)}
          field="screens"
          header="Screens"
        />
        <Column
          body={PermissionBody}
          className="max-w-[5rem] truncate"
          editor={(editor) => PermissionEditor(editor, UserData?.id as string, updatePermission, refetch)}
          field="dictionaries"
          header="Dictionaries"
        />
        <Column
          body={PermissionBody}
          className="max-w-[5rem] truncate"
          editor={(editor) => PermissionEditor(editor, UserData?.id as string, updatePermission, refetch)}
          field="random_tables"
          header="Random Tables"
        />
        <Column
          body={PermissionBody}
          className="max-w-[5rem] truncate"
          editor={(editor) => PermissionEditor(editor, UserData?.id as string, updatePermission, refetch)}
          field="tags"
          header="Tags"
        />
        <Column
          body={PermissionBody}
          className="max-w-[5rem] truncate"
          editor={(editor) => PermissionEditor(editor, UserData?.id as string, updatePermission, refetch)}
          field="title"
          header="Alter names"
        />
      </DataTable>
    </div>
  );
}
