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

import { MapImageDropdownItem } from "../../components/Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../../components/Dropdown/ImageDropdownValue";
import { IconSelect } from "../../components/IconSelect/IconSelect";
import { TitleEditor } from "../../components/Settings/Editors/TitleEditor";
import SettingsTable from "../../components/Settings/SettingsTable";
import Tags from "../../components/Tags/Tags";
import { useDeleteItem, useGetAllItems, useGetAllMapImages, useUpdateItem } from "../../CRUD/ItemsCRUD";
import { useGetAllTags } from "../../CRUD/OtherCRUD";
import { AvailableItemTypes, TagType } from "../../types/generalTypes";
import { MapType } from "../../types/mapTypes";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { getMapImageLink } from "../../utils/CRUD/CRUDUrls";
import { tagsFilterFunction } from "../../utils/settingsUtils";
import { toaster } from "../../utils/toast";
import { ParentColumn } from "./Columns";
import BooleanFilter from "./Filters/BooleanFilter";
import TagsFilter from "./Filters/TagsFilter";
import SettingsToolbar from "./SettingsToolbar";
// TABLE UTIL FUNCTIONS
function getCheckedValue(
  { folder, isPublic }: { folder: boolean; isPublic: boolean },
  type: "folder" | "template" | "isPublic",
) {
  if (type === "folder") return folder;
  if (type === "isPublic") return isPublic;
  return false;
}

function IconColumn({ id, icon, folder }: MapType) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const updateMapMutation = useUpdateItem<MapType>("maps", project_id as string);
  return (
    <div className="flex justify-center">
      <IconSelect
        disabled={folder}
        setIcon={(newIcon) => {
          updateMapMutation?.mutate(
            { icon: newIcon, id },
            {
              onSuccess: () => queryClient.refetchQueries({ queryKey: ["allItems", project_id, "maps"] }),
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
function ImageColumn({ image }: MapType) {
  const { project_id } = useParams();
  return image ? (
    <div className="flex h-8 w-full justify-center">
      <img alt={image || "column"} className="object-contain" src={getMapImageLink(image, project_id as string)} />
    </div>
  ) : null;
}
function ImageEditor(
  editorOptions: ColumnEditorOptions,
  images: string[] | undefined,
  updateDocument: (data: Partial<MapType>) => void,
) {
  const { rowData } = editorOptions as { rowData: MapType };
  if (rowData.folder) return null;
  return (
    <div className="w-36">
      <Dropdown
        className="w-full"
        itemTemplate={MapImageDropdownItem}
        onChange={(e) => updateDocument({ id: rowData.id, image: e.value })}
        options={["None", ...(images || [])] || []}
        placeholder="Select map"
        value={rowData?.image}
        valueTemplate={ImageDropdownValue({ image: rowData?.image })}
      />
    </div>
  );
}

function FolderPublicColumn({ id, folder, isPublic }: MapType, type: "folder" | "isPublic") {
  const { project_id } = useParams();
  const updateDocumentMutation = useUpdateItem("maps", project_id as string);
  const queryClient = useQueryClient();

  return (
    <Checkbox
      checked={getCheckedValue({ folder, isPublic }, type)}
      onChange={(e) =>
        updateDocumentMutation?.mutate(
          { [type]: e.checked, id },
          {
            onSuccess: () => {
              queryClient.refetchQueries({ queryKey: ["allItems", project_id, "maps"] });
              toaster("success", "Item updated successfully.");
            },
          },
        )
      }
    />
  );
}

function TagsColumn({ tags }: MapType, type: "tags") {
  return (
    <div className={`flex justify-center gap-x-1 ${type}Tags`}>
      {tags?.map((tag) => (
        <Tag key={tag.id} value={tag.title} />
      ))}
    </div>
  );
}

function TagsEditor(
  editorOptions: ColumnEditorOptions,
  updateItemTags: <ItemType>(type: AvailableItemTypes, id: string, variables: Partial<ItemType>) => void,
) {
  const { rowData, editorCallback } = editorOptions;
  return (
    <Tags
      handleChange={({ name, value }) => {
        updateItemTags<MapType>("maps", rowData.id, { [name]: value });
        if (editorCallback) editorCallback(value);
      }}
      localItem={rowData}
      type="maps"
    />
  );
}

function ActionsColumn({ id, folder }: MapType, navigate: NavigateFunction, deleteAction: (docId: string) => void) {
  return (
    <div className="flex justify-center gap-x-1">
      <Button
        className="p-button-success p-button-outlined"
        icon="pi pi-fw pi-link"
        onClick={() => {
          navigate(`../../maps/${folder ? "folder/" : ""}${id}`);
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

export default function MapSettings() {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const tableRef = useRef() as MutableRefObject<DataTable>;
  const { data: maps, isLoading } = useGetAllItems<MapType>(project_id as string, "maps");
  const { data: images } = useGetAllMapImages(project_id as string);
  const { data: tags } = useGetAllTags(project_id as string);
  const [selected, setSelected] = useState<MapType[]>([]);
  const [globalFilter, setGlobalFilter] = useState<{ title: string; tags: TagType[] }>({ title: "", tags: [] });

  const { mutate } = useUpdateItem("maps", project_id as string);
  const { mutate: deleteMutation } = useDeleteItem("maps", project_id as string);
  const queryClient = useQueryClient();

  function updateMap(data: Partial<MapType>) {
    mutate(data, {
      onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: ["allItems", project_id, "maps"] });
        toaster("success", "Item updated successfully.");
      },
    });
  }

  function updateItemTags<ItemType extends { id: string }>(type: AvailableItemTypes, id: string, variables: Partial<ItemType>) {
    queryClient.setQueryData(["allItems", project_id, type], (old: ItemType[] | undefined) => {
      if (old)
        return old.map((item) => {
          if (item.id === id) {
            return { ...item, ...variables };
          }
          return item;
        });
      return old;
    });
  }
  const deleteAction = (id: string) => deleteItem("Are you sure you want to delete this item?", () => deleteMutation(id));
  if (!maps && isLoading) return <ProgressSpinner />;
  if (!maps) return null;
  return (
    <div className="p-4">
      <SettingsToolbar
        ref={tableRef}
        filter={{ globalFilter, setGlobalFilter }}
        selection={{ selected, setSelected }}
        type="maps"
      />
      <SettingsTable data={maps} globalFilter={globalFilter} selected={selected} setSelected={setSelected} tableRef={tableRef}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column editor={(e) => TitleEditor(e, updateMap)} field="title" filter header="Title" sortable />
        <Column align="center" body={IconColumn} className="w-24" field="icon" header="Icon" />
        <Column
          align="center"
          body={ImageColumn}
          className="w-8"
          editor={(e) => ImageEditor(e, images, updateMap)}
          field="image"
          header="Image"
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
          editor={(e) => TagsEditor(e, updateItemTags)}
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
          body={(data) => FolderPublicColumn(data, "folder")}
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
          body={(data) => FolderPublicColumn(data, "isPublic")}
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
