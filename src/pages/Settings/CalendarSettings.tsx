import { useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column, ColumnEditorOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
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
import { CalendarType } from "../../types/ItemTypes/calendarTypes";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { getCheckedValue, tagsFilterFunction } from "../../utils/settingsUtils";
import { toaster } from "../../utils/toast";
import BooleanFilter from "./Filters/BooleanFilter";
import TagsFilter from "./Filters/TagsFilter";
import SettingsToolbar from "./SettingsToolbar";

function FolderPublicGridColumn({ id, folder, isPublic }: CalendarType, type: "folder" | "isPublic") {
  const { project_id } = useParams();
  const updateCalendarMutation = useUpdateItem("calendars", project_id as string);
  const queryClient = useQueryClient();

  return (
    <Checkbox
      checked={getCheckedValue({ folder, isPublic }, type)}
      onChange={(e) =>
        updateCalendarMutation?.mutate(
          { [type]: e.checked, id },
          {
            onSuccess: () => {
              queryClient.refetchQueries({ queryKey: ["allItems", project_id, "calendars"] });
              toaster("success", "Item updated successfully.");
            },
          },
        )
      }
    />
  );
}
function ParentColumn({ parent }: CalendarType, calendars: CalendarType[]) {
  // eslint-disable-next-line react/destructuring-assignment
  const parentFolder = calendars?.find((doc) => doc.id === parent?.id);
  if (parentFolder) return <div className="w-full">{parentFolder.title}</div>;
  return null;
}
function TagsColumn({ tags }: CalendarType, type: "tags") {
  return (
    <div className={`flex justify-center gap-x-1 ${type}Tags`}>
      {tags?.map((tag) => (
        <Tag key={tag.id} value={tag.title} />
      ))}
    </div>
  );
}
function TagsEditor(editorOptions: ColumnEditorOptions, updateCalendar: (data: Partial<CalendarType>) => void) {
  const { rowData, editorCallback } = editorOptions;
  return (
    <Tags
      handleChange={({ name, value }) => {
        updateCalendar({ id: rowData.id, [name]: value });
        if (editorCallback) editorCallback(value);
      }}
      localItem={rowData}
      type="calendars"
    />
  );
}
function ActionsColumn({ id, folder }: CalendarType, navigate: NavigateFunction, deleteAction: (calId: string) => void) {
  return (
    <div className="flex justify-center gap-x-1">
      <Button
        className="p-button-success p-button-outlined"
        icon="pi pi-fw pi-link"
        onClick={() => {
          navigate(`../../calendars/${folder ? "folder/" : ""}${id}`);
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
function ClockEditor(editorOptions: ColumnEditorOptions, updateItem: <T>(data: Partial<T>) => void, type: "hours" | "minutes") {
  const { rowData, editorCallback } = editorOptions;
  return (
    <InputNumber
      onChange={(e) => {
        if (rowData.id && e.value && editorCallback) editorCallback(e.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          updateItem({ id: rowData.id, [type]: parseFloat(e.currentTarget.value) });
        }
      }}
      useGrouping={false}
      value={rowData[type]}
    />
  );
}

export default function CalendarSettings() {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const tableRef = useRef() as MutableRefObject<DataTable>;
  const { data: calendars, isLoading } = useGetAllItems<CalendarType>(project_id as string, "calendars", {
    staleTime: 5 * 60 * 1000,
  });
  const { data: tags } = useGetAllTags(project_id as string);
  const [selected, setSelected] = useState<CalendarType[]>([]);
  const [globalFilter, setGlobalFilter] = useState<{ title: string; tags: TagType[] }>({ title: "", tags: [] });

  const { mutate } = useUpdateItem<CalendarType>("calendars", project_id as string);
  const { mutate: deleteMutation } = useDeleteItem("calendars", project_id as string);

  const updateCalendar = (data: Partial<CalendarType>) =>
    mutate(data, {
      onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: ["allItems", project_id, "calendars"] });
      },
    });
  const deleteAction = (id: string) => deleteItem("Are you sure you want to delete this item?", () => deleteMutation(id));

  return (
    <div className="p-4">
      <SettingsToolbar
        ref={tableRef}
        filter={{ globalFilter, setGlobalFilter }}
        selection={{ selected, setSelected }}
        type="calendars"
      />
      <SettingsTable
        data={calendars || []}
        globalFilter={globalFilter}
        isLoading={isLoading}
        selected={selected}
        setSelected={setSelected}
        tableRef={tableRef}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column editor={(e) => TitleEditor(e, updateCalendar)} field="title" filter header="Title" sortable />
        <Column
          bodyStyle={{ textAlign: "center" }}
          className="w-20"
          editor={(e) => ClockEditor(e, updateCalendar, "hours")}
          field="hours"
          header="Hours"
        />
        <Column
          bodyStyle={{ textAlign: "center" }}
          className="w-20"
          editor={(e) => ClockEditor(e, updateCalendar, "minutes")}
          field="minutes"
          header="Minutes"
        />
        <Column
          align="center"
          body={(data) => IconColumn<CalendarType>({ ...data, type: "calendars" })}
          className="w-24"
          field="icon"
          header="Icon"
        />

        <Column
          align="center"
          body={(data) => ParentColumn(data, calendars || [])}
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
