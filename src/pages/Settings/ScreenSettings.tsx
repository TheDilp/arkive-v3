import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column, ColumnEditorOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { MutableRefObject, useRef, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

import { IconSelect } from "../../components/IconSelect/IconSelect";
import { TitleEditor } from "../../components/Settings/Editors/TitleEditor";
import SettingsTable from "../../components/Settings/SettingsTable";
import Tags from "../../components/Tags/Tags";
import { useDeleteItem, useGetAllItems, useUpdateItem } from "../../CRUD/ItemsCRUD";
import { useGetAllTags } from "../../CRUD/OtherCRUD";
import { TagType } from "../../types/generalTypes";
import { ScreenType } from "../../types/ItemTypes/screenTypes";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { getCheckedValue, tagsFilterFunction } from "../../utils/settingsUtils";
import { toaster } from "../../utils/toast";
import { ParentColumn } from "./Columns";
import BooleanFilter from "./Filters/BooleanFilter";
import TagsFilter from "./Filters/TagsFilter";
import SettingsToolbar from "./SettingsToolbar";
// TABLE UTIL FUNCTIONS

function IconColumn({ id, icon, folder }: ScreenType) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const updateDocumentMutation = useUpdateItem<ScreenType>("screens", project_id as string);
  return (
    <div className="flex justify-center">
      <IconSelect
        disabled={folder}
        setIcon={(newIcon) => {
          updateDocumentMutation?.mutate(
            { icon: newIcon, id },
            {
              onSuccess: () => queryClient.refetchQueries({ queryKey: ["allItems", project_id, "screens"] }),
            },
          );
        }}>
        <Icon
          className={`rounded-full ${folder ? "" : "cursor-pointer hover:bg-sky-400"}`}
          fontSize={24}
          icon={folder ? "mdi:folder" : icon || "mdi:file"}
          inline
        />
      </IconSelect>
    </div>
  );
}

function FolderTemplatePublicColumn({ id, folder, isPublic }: ScreenType, type: "folder" | "isPublic") {
  const { project_id } = useParams();
  const updateDocumentMutation = useUpdateItem("screens", project_id as string);
  const queryClient = useQueryClient();

  return (
    <Checkbox
      checked={getCheckedValue({ folder, isPublic }, type)}
      onChange={(e) =>
        updateDocumentMutation?.mutate(
          { [type]: e.checked, id },
          {
            onSuccess: () => queryClient.refetchQueries({ queryKey: ["allItems", project_id, "screens"] }),
          },
        )
      }
    />
  );
}

function TagsColumn({ tags }: ScreenType, type: "tags") {
  return (
    <div className={`flex w-[10rem] flex-wrap justify-center gap-1 truncate ${type}Tags`}>
      {type === "tags" ? tags?.map((tag) => <Tag key={tag.id} value={tag.title} />) : null}
    </div>
  );
}

function TagsEditor(editorOptions: ColumnEditorOptions) {
  const { rowData, editorCallback } = editorOptions;
  return (
    <Tags
      handleChange={({ value }) => {
        if (editorCallback) editorCallback(value);
      }}
      localItem={rowData}
      type="screens"
    />
  );
}

function ActionsColumn({ id, folder }: ScreenType, navigate: NavigateFunction, deleteAction: (docId: string) => void) {
  return (
    <div className="flex justify-center gap-x-1">
      <Button
        className="p-button-success p-button-outlined"
        icon="pi pi-fw pi-link"
        onClick={() => {
          navigate(`../../screens/${folder ? "folder/" : ""}${id}`);
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

export default function ScreenSettings() {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const tableRef = useRef() as MutableRefObject<DataTable>;
  const { data: screens, isLoading } = useGetAllItems<ScreenType>(project_id as string, "screens");
  const { data: tags } = useGetAllTags(project_id as string);
  const [selected, setSelected] = useState<ScreenType[]>([]);
  const [globalFilter, setGlobalFilter] = useState<{ title: string; tags: TagType[] }>({ title: "", tags: [] });
  const { mutate } = useUpdateItem("screens", project_id as string);
  const { mutate: deleteMutation } = useDeleteItem("screens", project_id as string);
  const queryClient = useQueryClient();

  const updateDocument = (data: Partial<ScreenType>) =>
    mutate(data, {
      onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: ["allItems", project_id, "screens"] });
        toaster("success", "Item updated successfully.");
      },
    });

  const deleteAction = (id: string) => deleteItem("Are you sure you want to delete this item?", () => deleteMutation(id));
  return (
    <div className="h-[95vh] w-full overflow-hidden p-4">
      <SettingsToolbar
        ref={tableRef}
        filter={{ globalFilter, setGlobalFilter }}
        selection={{ selected, setSelected }}
        type="screens"
      />
      <SettingsTable
        data={screens || []}
        globalFilter={globalFilter}
        isLoading={isLoading}
        selected={selected}
        setSelected={setSelected}
        tableRef={tableRef}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column
          className="max-w-[15rem] truncate"
          editor={(e) => TitleEditor(e, updateDocument)}
          field="title"
          filter
          header="Title"
          sortable
        />
        <Column align="center" body={IconColumn} className="w-8" field="icon" header="Icon" />

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
          editor={TagsEditor}
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
          body={(data) => FolderTemplatePublicColumn(data, "folder")}
          className="max-w-min"
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
          body={(data) => FolderTemplatePublicColumn(data, "isPublic")}
          className="max-w-min"
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
