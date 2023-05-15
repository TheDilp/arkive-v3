import { useSetAtom } from "jotai";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableSelection } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { MutableRefObject, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetSingleProject } from "../../CRUD/ProjectCRUD";
import { useAuth } from "../../hooks/useAuth";
import { baseURLS } from "../../types/CRUDenums";
import { MemberType } from "../../types/generalTypes";
import { ProjectType } from "../../types/ItemTypes/projectTypes";
import { ProjectAtom } from "../../utils/Atoms/atoms";
import { FetchFunction } from "../../utils/CRUD/CRUDFetch";

function Header() {
  const [addNew, setAddNew] = useState(false);
  const [email, setEmail] = useState("");
  const { project_id } = useParams();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        className="p-button-outlined p-button-rounded"
        icon="pi pi-user-plus"
        onClick={() => setAddNew((prev) => !prev)}
        severity="success"
      />
      {addNew ? <InputText onChange={(e) => setEmail(e.target.value)} /> : null}
      {addNew ? (
        <Button
          className="p-button-outlined"
          icon="pi pi-send"
          label="Send invite"
          onClick={async () => {
            FetchFunction({
              url: `${baseURLS.baseServer}addtoproject`,
              method: "POST",
              body: JSON.stringify({ email, project_id }),
            });
          }}
        />
      ) : null}
    </div>
  );
}

export default function MemberSettings() {
  const { project_id } = useParams();
  const tableRef = useRef() as MutableRefObject<DataTable<MemberType[]>>;
  const setProjectAtom = useSetAtom(ProjectAtom);
  const [selected, setSelected] = useState<DataTableSelection<MemberType[]>>([]);
  const { user } = useAuth();
  const { data: projectData, isFetching: isFetchingProject } = useGetSingleProject(project_id as string, {
    enabled: !!user,
    onSuccess: (data) => {
      setProjectAtom(data as ProjectType);
    },
  });
  if (!projectData) return null;
  return (
    <div className="h-[95vh] w-full overflow-hidden p-4">
      <DataTable
        ref={tableRef}
        className="h-full w-full"
        dataKey="id"
        editMode="cell"
        filterDisplay="menu"
        header={Header}
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
        <Column className="max-w-[15rem] truncate" field="title" filter header="Title" sortable />
      </DataTable>
    </div>
  );
}
