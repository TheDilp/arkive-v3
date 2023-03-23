import { UseMutateFunction } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import AlterNameTagTitle from "../../components/Settings/Columns/AlterNameTagTitle";
import { TitleEditor } from "../../components/Settings/Editors/TitleEditor";
import { useDeleteAlterNamesTags, useGetAlterNameSettings, useUpdateAlterNameTag } from "../../CRUD/OtherCRUD";
import { AlterNameType } from "../../types/ItemTypes/documentTypes";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { toaster } from "../../utils/toast";

function DeleteColumn(item: AlterNameType, deleteTags: UseMutateFunction<any, unknown, string[], unknown>) {
  const { id } = item;
  return (
    <div className="flex justify-center gap-x-1">
      <Button
        className="p-button-outlined p-button-danger"
        icon="pi pi-fw pi-trash"
        onClick={() =>
          deleteItem("Are you sure you want to delete this alternative name?", () =>
            deleteTags([id], {
              onSuccess: () => toaster("success", "Alternative name successfully deleted."),
            }),
          )
        }
        tooltip="Delete alternative name"
        tooltipOptions={{ showDelay: 300, position: "left" }}
      />
    </div>
  );
}

export default function AlternativeNameSettings() {
  const { project_id } = useParams();
  const [selected, setSelected] = useState<string[]>([]);
  const { mutate: updateAlterName } = useUpdateAlterNameTag<AlterNameType>(project_id as string, "alter_name");
  const { mutate: deleteAlterNames } = useDeleteAlterNamesTags<AlterNameType>(project_id as string, "alter_name");
  const { data: alter_names, isLoading: isLoadingTags } = useGetAlterNameSettings(project_id as string);
  return (
    <div className="tagSettings h-screen px-4 pt-4 pb-16">
      <DataTable
        editMode="cell"
        loading={isLoadingTags}
        onSelectionChange={(e) => setSelected(e.value)}
        paginator
        removableSort
        rows={10}
        selection={selected}
        selectionMode="checkbox"
        size="small"
        sortMode="multiple"
        value={alter_names}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column
          body={(data) => AlterNameTagTitle(data, "alter_name")}
          editor={(e) => TitleEditor(e, (data) => updateAlterName(data))}
          field="title"
          header="Alternative name"
          sortable
        />
        <Column field="document.title" filter header="Document" sortable />
        <Column align="center" body={(e) => DeleteColumn(e, deleteAlterNames)} className="w-32" header="Delete Name" />
      </DataTable>
    </div>
  );
}
