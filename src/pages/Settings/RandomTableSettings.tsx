import { useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column, ColumnEditorOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { MutableRefObject, useRef, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

import IconColumn from "../../components/Settings/Columns/IconColumn";
import { TitleEditor } from "../../components/Settings/Editors/TitleEditor";
import SettingsTable from "../../components/Settings/SettingsTable";
import Tags from "../../components/Tags/Tags";
import { useDeleteItem, useGetAllItems, useUpdateItem } from "../../CRUD/ItemsCRUD";
import { useGetAllTags } from "../../CRUD/OtherCRUD";
import { TagType } from "../../types/generalTypes";
import { RandomTableType } from "../../types/ItemTypes/randomTableTypes";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { getCheckedValue, tagsFilterFunction } from "../../utils/settingsUtils";
import { toaster } from "../../utils/toast";
import { ParentColumn } from "./Columns";
import BooleanFilter from "./Filters/BooleanFilter";
import TagsFilter from "./Filters/TagsFilter";
import SettingsToolbar from "./SettingsToolbar";

function FolderPublicGridColumn({ id, folder, isPublic }: RandomTableType, type: "folder" | "isPublic") {
  const { project_id } = useParams();
  const updateCalendarMutation = useUpdateItem("randomtables", project_id as string);
  const queryClient = useQueryClient();

  return (
    <Checkbox
      checked={getCheckedValue({ folder, isPublic }, type)}
      onChange={(e) =>
        updateCalendarMutation?.mutate(
          { [type]: e.checked, id },
          {
            onSuccess: () => {
              queryClient.refetchQueries({ queryKey: ["allItems", project_id, "randomtables"] });
              toaster("success", "Item updated successfully.");
            },
          },
        )
      }
    />
  );
}

function TagsColumn({ tags }: RandomTableType, type: "tags") {
  return (
    <div className={`flex justify-center gap-x-1 ${type}Tags`}>
      {tags?.map((tag) => (
        <Tag key={tag.id} value={tag.title} />
      ))}
    </div>
  );
}
function TagsEditor(editorOptions: ColumnEditorOptions, updateCalendar: (data: Partial<RandomTableType>) => void) {
  const { rowData, editorCallback } = editorOptions;
  return (
    <Tags
      handleChange={({ name, value }) => {
        updateCalendar({ id: rowData.id, [name]: value });
        if (editorCallback) editorCallback(value);
      }}
      localItem={rowData}
      type="randomtables"
    />
  );
}
function ActionsColumn({ id, folder }: RandomTableType, navigate: NavigateFunction, deleteAction: (calId: string) => void) {
  return (
    <div className="flex justify-center gap-x-1">
      <Button
        className="p-button-success p-button-outlined"
        icon="pi pi-fw pi-link"
        onClick={() => {
          navigate(`../../randomtables/${folder ? "folder/" : ""}${id}`);
        }}
        tooltip="Go to item"
        tooltipOptions={{ showDelay: 300, position: "left" }}
      />
      <Button
        className="p-button-danger p-button-outlined"
        icon="pi pi-fw pi-trash"
        iconPos="right"
        onClick={() => deleteAction(id)}
      />
    </div>
  );
}

export default function RandomTableSettings() {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const tableRef = useRef() as MutableRefObject<DataTable>;
  const { data: randomtables, isLoading } = useGetAllItems<RandomTableType>(project_id as string, "randomtables", {
    staleTime: 5 * 60 * 1000,
  });
  const { data: tags } = useGetAllTags(project_id as string);
  const [selected, setSelected] = useState<RandomTableType[]>([]);
  const [globalFilter, setGlobalFilter] = useState<{ title: string; tags: TagType[] }>({ title: "", tags: [] });

  const { mutate } = useUpdateItem<RandomTableType>("randomtables", project_id as string);
  const { mutate: deleteMutation } = useDeleteItem("randomtables", project_id as string);

  const updateCalendar = (data: Partial<RandomTableType>) =>
    mutate(data, {
      onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: ["allItems", project_id, "randomtables"] });
      },
    });
  const deleteAction = (id: string) => deleteItem("Are you sure you want to delete this item?", () => deleteMutation(id));

  return (
    <div className="p-4">
      <SettingsToolbar
        ref={tableRef}
        filter={{ globalFilter, setGlobalFilter }}
        selection={{ selected, setSelected }}
        type="randomtables"
      />
      <SettingsTable
        data={randomtables || []}
        globalFilter={globalFilter}
        isLoading={isLoading}
        selected={selected}
        setSelected={setSelected}
        tableRef={tableRef}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column editor={(e) => TitleEditor(e, updateCalendar)} field="title" filter header="Title" sortable />
        <Column
          align="center"
          body={(data) => IconColumn<RandomTableType>({ ...data, type: "randomtables" })}
          className="w-24"
          field="icon"
          header="Icon"
        />

        <Column
          align="center"
          body={ParentColumn}
          className="w-48"
          field="parent.title"
          filter
          header="Parent"
          sortable
          sortField="parent.title"
        />
        <Column
          align="center"
          body={(data) => TagsColumn(data, "tags")}
          editor={(e) => TagsEditor(e, updateCalendar)}
          field="tags"
          filter
          filterElement={(options) => TagsFilter(options, tags ?? [])}
          filterFunction={tagsFilterFunction}
          filterMatchMode="custom"
          header="Tags"
          showFilterMatchModes={false}
          sortable
          sortField="tags"
        />
        <Column
          align="center"
          body={(data) => FolderPublicGridColumn(data, "folder")}
          className="w-10"
          dataType="boolean"
          field="folder"
          filter
          filterElement={BooleanFilter}
          filterMatchMode="equals"
          header="Folder"
          sortable
        />

        <Column
          align="center"
          body={(data) => FolderPublicGridColumn(data, "isPublic")}
          className="w-10"
          dataType="boolean"
          field="isPublic"
          filter
          filterElement={BooleanFilter}
          filterMatchMode="equals"
          header="Public"
          sortable
        />

        <Column align="center" body={(data) => ActionsColumn(data, navigate, deleteAction)} header="Actions" />
      </SettingsTable>
    </div>
  );
}
