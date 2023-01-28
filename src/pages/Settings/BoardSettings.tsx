import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column, ColumnEditorOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { MutableRefObject, useRef, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { capitalCase } from "remirror";
import { DebouncedState, useDebouncedCallback } from "use-debounce";

import ColorInput from "../../components/ColorInput/ColorInput";
import { IconSelect } from "../../components/IconSelect/IconSelect";
import { TitleEditor } from "../../components/Settings/Editors/TitleEditor";
import SettingsTable from "../../components/Settings/SettingsTable";
import Tags from "../../components/Tags/Tags";
import { useDeleteItem, useGetAllItems, useUpdateItem } from "../../CRUD/ItemsCRUD";
import { useGetAllTags } from "../../CRUD/OtherCRUD";
import { BoardType } from "../../types/ItemTypes/boardTypes";
import { TagType } from "../../types/generalTypes";
import { boardNodeShapes } from "../../utils/boardUtils";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { defaultNodeFilterFunction, tagsFilterFunction } from "../../utils/settingsUtils";
import { toaster } from "../../utils/toast";
import BooleanFilter from "./Filters/BooleanFilter";
import DefaultNodeFilter from "./Filters/DefaultNodeFilter";
import TagsFilter from "./Filters/TagsFilter";
import SettingsToolbar from "./SettingsToolbar";
// TABLE UTIL FUNCTIONS
function getCheckedValue(
  { folder, isPublic, defaultGrid }: { folder: boolean; isPublic: boolean; defaultGrid: boolean },
  type: "folder" | "defaultGrid" | "isPublic",
) {
  if (type === "folder") return folder;
  if (type === "isPublic") return isPublic;
  if (type === "defaultGrid") return defaultGrid;
  return false;
}

function IconColumn({ id, icon, folder }: BoardType) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const updateMapMutation = useUpdateItem<BoardType>("boards", project_id as string);
  return (
    <div className="flex justify-center">
      <IconSelect
        disabled={folder}
        setIcon={(newIcon) => {
          updateMapMutation?.mutate(
            { icon: newIcon, id },
            {
              onSuccess: () => {
                queryClient.refetchQueries({ queryKey: ["allItems", project_id, "boards"] });
                toaster("success", "Icon updated successfully.");
              },
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

function FolderPublicGridColumn({ id, folder, isPublic, defaultGrid }: BoardType, type: "folder" | "isPublic" | "defaultGrid") {
  const { project_id } = useParams();
  const updateDocumentMutation = useUpdateItem("boards", project_id as string);
  const queryClient = useQueryClient();

  return (
    <Checkbox
      checked={getCheckedValue({ folder, isPublic, defaultGrid }, type)}
      onChange={(e) =>
        updateDocumentMutation?.mutate(
          { [type]: e.checked, id },
          {
            onSuccess: () => {
              queryClient.refetchQueries({ queryKey: ["allItems", project_id, "boards"] });
              toaster("success", "Item updated successfully.");
            },
          },
        )
      }
    />
  );
}
function ParentColumn({ parent }: BoardType, boards: BoardType[]) {
  // eslint-disable-next-line react/destructuring-assignment
  const parentFolder = boards?.find((doc) => doc.id === parent?.id);
  if (parentFolder) return <div className="w-full">{parentFolder.title}</div>;
  return null;
}

function TagsColumn({ tags }: BoardType, type: "tags") {
  return (
    <div className={`flex justify-center gap-x-1 ${type}Tags`}>
      {tags?.map((tag) => (
        <Tag key={tag.id} value={tag.title} />
      ))}
    </div>
  );
}

function TagsEditor(editorOptions: ColumnEditorOptions, updateBoard: (data: Partial<BoardType>) => void) {
  const { rowData, editorCallback } = editorOptions;
  return (
    <Tags
      handleChange={({ name, value }) => {
        updateBoard({ id: rowData.id, [name]: value });
        if (editorCallback) editorCallback(value);
      }}
      localItem={rowData}
      type="boards"
    />
  );
}
function NodeShapeEditor(editorOptions: ColumnEditorOptions, updateBoard: (data: Partial<BoardType>) => void) {
  const { rowData, editorCallback } = editorOptions;
  return (
    <Dropdown
      className="w-full"
      filter
      onChange={(e) => {
        updateBoard({ id: rowData.id, defaultNodeShape: e.value });
        if (editorCallback) editorCallback(e.value);
      }}
      options={boardNodeShapes}
      placeholder="Default Node Shape"
      value={rowData.defaultNodeShape}
    />
  );
}
function ColorEditor(
  editorOptions: ColumnEditorOptions,
  updateBoard: DebouncedState<(id: string, newColor: string, name: string) => void>,
  colorType: "defaultNodeColor" | "defaultEdgeColor",
) {
  const { rowData, editorCallback } = editorOptions;
  return (
    <ColorInput
      color={rowData[colorType]}
      name={colorType}
      onChange={({ value }) => {
        if (editorCallback) editorCallback(value);
        updateBoard(rowData.id, value, colorType);
      }}
    />
  );
}
function ActionsColumn({ id, folder }: BoardType, navigate: NavigateFunction, deleteAction: (docId: string) => void) {
  return (
    <div className="flex justify-center gap-x-1">
      <Button
        className="p-button-success p-button-outlined"
        icon="pi pi-fw pi-link"
        onClick={() => {
          navigate(`../../boards/${folder ? "folder/" : ""}${id}`);
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

export default function BoardSettings() {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const tableRef = useRef() as MutableRefObject<DataTable>;
  const { data: boards, isLoading } = useGetAllItems<BoardType>(project_id as string, "boards");
  const { data: tags } = useGetAllTags(project_id as string);

  const [selected, setSelected] = useState<BoardType[]>([]);
  const [globalFilter, setGlobalFilter] = useState<{ title: string; tags: TagType[] }>({ title: "", tags: [] });

  const { mutate } = useUpdateItem<BoardType>("boards", project_id as string);
  const { mutate: deleteMutation } = useDeleteItem("boards", project_id as string);
  const queryClient = useQueryClient();

  const debouncedColorUpdate = useDebouncedCallback((id: string, newColor: string, name: string) => {
    mutate(
      { id, [name]: newColor },
      {
        onSuccess: async () => {
          await queryClient.refetchQueries({ queryKey: ["allItems", project_id, "boards"] });
        },
      },
    );
  }, 850);

  const updateBoard = (data: Partial<BoardType>) =>
    mutate(data, {
      onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: ["allItems", project_id, "boards"] });
      },
    });
  const deleteAction = (id: string) => deleteItem("Are you sure you want to delete this item?", () => deleteMutation(id));
  if (!boards && isLoading) return <ProgressSpinner />;
  if (!boards) return null;
  return (
    <div className="p-4">
      <SettingsToolbar
        ref={tableRef}
        filter={{ globalFilter, setGlobalFilter }}
        selection={{ selected, setSelected }}
        type="boards"
      />
      <SettingsTable
        data={boards}
        globalFilter={globalFilter}
        selected={selected}
        setSelected={setSelected}
        tableRef={tableRef}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column editor={(e) => TitleEditor(e, updateBoard)} field="title" filter header="Title" sortable />
        <Column align="center" body={IconColumn} className="w-24" field="icon" header="Icon" />

        <Column
          align="center"
          body={(data) => ParentColumn(data, boards)}
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
          editor={(e) => TagsEditor(e, updateBoard)}
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
        <Column
          align="center"
          body={(data) => FolderPublicGridColumn(data, "defaultGrid")}
          className="w-10"
          dataType="boolean"
          field="defaultGrid"
          filter
          filterElement={BooleanFilter}
          filterMatchMode="equals"
          header="Grid"
          sortable
        />
        <Column
          align="center"
          body={(data: BoardType) => capitalCase(data.defaultNodeShape)}
          editor={(e) => NodeShapeEditor(e, updateBoard)}
          field="defaultNodeShape"
          filter
          filterElement={DefaultNodeFilter}
          filterFunction={defaultNodeFilterFunction}
          filterMatchMode="custom"
          header="Default Node"
          showFilterMatchModes={false}
          sortable
          sortField="defaultNodeShape"
        />
        <Column
          align="center"
          body={(data: BoardType) => data.defaultNodeColor}
          editor={(e) => ColorEditor(e, debouncedColorUpdate, "defaultNodeColor")}
          field="defaultNodeColor"
          header="Default Node Color"
          sortable
          sortField="defaultNodeColor"
        />
        <Column
          align="center"
          body={(data: BoardType) => data.defaultEdgeColor}
          editor={(e) => ColorEditor(e, debouncedColorUpdate, "defaultEdgeColor")}
          field="defaultEdgeColor"
          header="Default Edge Color"
          sortable
          sortField="defaultEdgeColor"
        />

        <Column align="center" body={(data) => ActionsColumn(data, navigate, deleteAction)} header="Actions" />
      </SettingsTable>
    </div>
  );
}
