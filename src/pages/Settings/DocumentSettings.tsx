import { useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column, ColumnEditorOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { MutableRefObject, useRef, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

import { ImageDropdownItem } from "../../components/Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../../components/Dropdown/ImageDropdownValue";
import IconColumn from "../../components/Settings/Columns/IconColumn";
import { TitleEditor } from "../../components/Settings/Editors/TitleEditor";
import SettingsTable from "../../components/Settings/SettingsTable";
import { useDeleteItem, useGetAllImages, useGetAllItems, useUpdateItem } from "../../CRUD/ItemsCRUD";
import { useGetAllTags } from "../../CRUD/OtherCRUD";
import { TagType } from "../../types/generalTypes";
import { DocumentType } from "../../types/ItemTypes/documentTypes";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { getImageLink } from "../../utils/CRUD/CRUDUrls";
import { getCheckedValue, tagsFilterFunction } from "../../utils/settingsUtils";
import { toaster } from "../../utils/toast";
import { virtualScrollerSettings } from "../../utils/uiUtils";
import { ParentColumn } from "./Columns";
import BooleanFilter from "./Filters/BooleanFilter";
import TagsFilter from "./Filters/TagsFilter";
import SettingsToolbar from "./SettingsToolbar";
// TABLE UTIL FUNCTIONS

function ImageColumn({ image }: DocumentType) {
  return image ? (
    <div className="flex h-8 w-full justify-center">
      <img alt={image || "column"} className="object-contain" src={getImageLink(image)} />
    </div>
  ) : null;
}
function ImageEditor(
  editorOptions: ColumnEditorOptions,
  images: string[] | undefined,
  updateDocument: (data: Partial<DocumentType>) => void,
) {
  const { rowData } = editorOptions as { rowData: DocumentType };
  if (rowData.folder) return null;
  return (
    <div className="w-36">
      <Dropdown
        className="w-full"
        filter
        itemTemplate={ImageDropdownItem}
        onChange={(e) => updateDocument({ id: rowData.id, image: e.value })}
        options={["None", ...(images || [])] || []}
        placeholder="Select image"
        value={rowData?.image}
        valueTemplate={ImageDropdownValue({ image: rowData?.image })}
        virtualScrollerOptions={virtualScrollerSettings}
      />
    </div>
  );
}
function FolderTemplatePublicColumn(
  { id, folder, template, isPublic }: DocumentType,
  type: "folder" | "template" | "isPublic",
) {
  const { project_id } = useParams();
  const updateDocumentMutation = useUpdateItem("documents", project_id as string);
  const queryClient = useQueryClient();

  return (
    <Checkbox
      checked={getCheckedValue({ folder, template, isPublic }, type) ?? false}
      disabled={type === "template"}
      onChange={(e) =>
        updateDocumentMutation?.mutate(
          { [type]: e.checked, id },
          {
            onSuccess: () => queryClient.refetchQueries({ queryKey: ["allItems", project_id, "documents"] }),
          },
        )
      }
    />
  );
}
function TagsAlterNamesColumn({ alter_names, tags }: DocumentType, type: "tags" | "alter_names") {
  return (
    <div className={`flex w-[10rem] flex-wrap justify-center gap-1 truncate ${type}Tags`}>
      {type === "tags" ? tags.map((tag) => <Tag key={tag.id} value={tag.title} />) : null}
      {type === "alter_names" ? alter_names.map((alter_name) => <Tag key={alter_name.id} value={alter_name.title} />) : null}
    </div>
  );
}

function ActionsColumn({ id, folder }: DocumentType, navigate: NavigateFunction, deleteAction: (docId: string) => void) {
  return (
    <div className="flex justify-center gap-x-1">
      <Button
        className="p-button-success p-button-outlined"
        icon="pi pi-fw pi-link"
        onClick={() => {
          navigate(`../../documents/${folder ? "folder/" : ""}${id}`);
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

export default function DocumentSettings() {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const tableRef = useRef() as MutableRefObject<DataTable<DocumentType[]>>;
  const { data: documents, isLoading } = useGetAllItems<DocumentType>(project_id as string, "documents");
  const { data: tags } = useGetAllTags(project_id as string);
  const { data: images } = useGetAllImages(project_id as string);
  const [selected, setSelected] = useState<DocumentType[]>([]);
  const [globalFilter, setGlobalFilter] = useState<{ title: string; tags: TagType[] }>({ title: "", tags: [] });
  const { mutate } = useUpdateItem("documents", project_id as string);
  const { mutate: deleteMutation } = useDeleteItem("documents", project_id as string);
  const queryClient = useQueryClient();
  const updateDocument = (data: Partial<DocumentType>) =>
    mutate(data, {
      onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: ["allItems", project_id, "documents"] });
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
        type="documents"
      />
      <SettingsTable
        data={documents || []}
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
        <Column
          align="center"
          body={(data) => IconColumn<DocumentType>({ ...data, type: "documents" })}
          className="w-8"
          field="icon"
          header="Icon"
        />
        <Column
          align="center"
          body={ImageColumn}
          className="w-20"
          editor={(e) => ImageEditor(e, images, updateDocument)}
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
          body={(data) => FolderTemplatePublicColumn(data, "template")}
          className="max-w-min"
          dataType="boolean"
          field="template"
          filter
          filterElement={BooleanFilter}
          filterMatchMode="equals"
          header="Template"
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

        <Column
          align="center"
          body={(data) => TagsAlterNamesColumn(data, "alter_names")}
          field="alter_names"
          header="Alternative Names"
          sortable
          sortField="alter_names"
        />
        <Column
          align="center"
          body={(data) => TagsAlterNamesColumn(data, "tags")}
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
        <Column align="center" body={(data) => ActionsColumn(data, navigate, deleteAction)} header="Actions" />
      </SettingsTable>
    </div>
  );
}
