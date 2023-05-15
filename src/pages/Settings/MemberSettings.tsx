import { useSetAtom } from "jotai";
import { Column } from "primereact/column";
import { DataTable, DataTableSelection } from "primereact/datatable";
import { MutableRefObject, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetSingleProject } from "../../CRUD/ProjectCRUD";
import { useAuth } from "../../hooks/useAuth";
import { MemberType } from "../../types/generalTypes";
import { ProjectType } from "../../types/ItemTypes/projectTypes";
import { ProjectAtom } from "../../utils/Atoms/atoms";

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
