import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "primereact/checkbox";
import { Column, ColumnEditorOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { MutableRefObject, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { ImageDropdownItem } from "../../components/Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../../components/Dropdown/ImageDropdownValue";
import { IconSelect } from "../../components/IconSelect/IconSelect";
import Tags from "../../components/Tags/Tags";
import { useGetAllImages, useGetAllItems, useUpdateItem } from "../../CRUD/ItemsCRUD";
import { DocumentType } from "../../types/documentTypes";
import { getImageLink } from "../../utils/CRUD/CRUDUrls";
import { toaster } from "../../utils/toast";
import SettingsToolbar from "./SettingsToolbar";
// TABLE UTIL FUNCTIONS
function getCheckedValue(
  { folder, template, isPublic }: { folder: boolean; template: boolean; isPublic: boolean },
  type: "folder" | "template" | "isPublic",
) {
  if (type === "folder") return folder;
  if (type === "template") return template;
  if (type === "isPublic") return isPublic;
  return false;
}

function TitleEditor(editorOptions: ColumnEditorOptions, updateDocument: (data: Partial<DocumentType>) => void) {
  const { rowData, editorCallback } = editorOptions;

  return (
    <InputText
      onChange={(e) => {
        if (rowData.id && e.currentTarget.value && editorCallback) editorCallback(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          updateDocument({ id: rowData.id, title: e.currentTarget.value });
        }
      }}
      value={rowData.title}
    />
  );
}
function IconColumn({ id, icon, folder }: DocumentType) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const updateDocumentMutation = useUpdateItem("documents");
  return (
    <div className="flex justify-center">
      <IconSelect
        disabled={folder}
        setIcon={(newIcon) => {
          updateDocumentMutation?.mutate(
            { icon: newIcon, id },
            {
              onSuccess: () => {
                queryClient.refetchQueries({ queryKey: ["allItems", project_id, "documents"] });
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
function ImageColumn({ image }: DocumentType) {
  const { project_id } = useParams();
  return image ? (
    <div className="flex justify-center w-full h-8">
      <img alt={image || "column"} className="object-contain" src={getImageLink(image, project_id as string)} />
    </div>
  ) : null;
}
function ImageEditor(
  editorOptions: ColumnEditorOptions,
  images: string[] | undefined,
  updateDocument: (data: Partial<DocumentType>) => void,
) {
  const { rowData } = editorOptions as { rowData: DocumentType };
  return (
    <div className="w-36">
      <Dropdown
        className="w-full"
        itemTemplate={ImageDropdownItem}
        onChange={(e) => updateDocument({ id: rowData.id, image: e.value })}
        options={["None", ...(images || [])] || []}
        placeholder="Select map"
        value={rowData?.image}
        valueTemplate={ImageDropdownValue({ image: rowData?.image })}
      />
    </div>
  );
}

function FolderTemplatePublicColumn(
  { id, folder, template, isPublic }: DocumentType,
  type: "folder" | "template" | "isPublic",
) {
  const { project_id } = useParams();
  const updateDocumentMutation = useUpdateItem("documents");
  const queryClient = useQueryClient();

  return (
    <Checkbox
      checked={getCheckedValue({ folder, template, isPublic }, type)}
      disabled={type === "template"}
      onChange={(e) =>
        updateDocumentMutation?.mutate(
          { [type]: e.checked, id },
          {
            onSuccess: () => {
              queryClient.refetchQueries({ queryKey: ["allItems", project_id, "documents"] });
              toaster("success", "Item updated successfully.");
            },
          },
        )
      }
    />
  );
}
function ParentColumn({ parent }: DocumentType, documents: DocumentType[]) {
  // eslint-disable-next-line react/destructuring-assignment
  const parentFolder = documents?.find((doc) => doc.id === parent);
  if (parentFolder) return <div className="w-full">{parentFolder.title}</div>;
  return null;
}

function TagsColumn({ tags }: DocumentType) {
  return (
    <div className="flex justify-center gap-x-1">
      {tags.map((tag) => (
        <Tag key={tag} value={tag} />
      ))}
    </div>
  );
}
function TagsEditor(
  editorOptions: ColumnEditorOptions,
  updateDocument: (data: Partial<DocumentType>) => void,
  refetchTags: () => void,
) {
  const { rowData, editorCallback } = editorOptions;
  return (
    <Tags
      handleChange={({ name, value }) => {
        if (editorCallback) editorCallback(value);
        updateDocument({ id: rowData.id, [name]: value });
        refetchTags();
      }}
      localItem={rowData}
      type="documents"
    />
  );
}

export default function DocumentSettings() {
  const { project_id } = useParams();

  const tableRef = useRef() as MutableRefObject<DataTable>;
  const { data: documents } = useGetAllItems(project_id as string, "documents") as { data: DocumentType[] };
  const { data: images } = useGetAllImages(project_id as string);
  const [selected, setSelected] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const { mutate } = useUpdateItem("documents");
  const queryClient = useQueryClient();

  const updateDocument = (data: Partial<DocumentType>) =>
    mutate(data, {
      onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: ["allItems", project_id, "documents"] });
        toaster("success", "Item updated successfully.");
      },
    });
  const refetchTags = async () => queryClient.refetchQueries({ queryKey: ["allTags", project_id, "documents"] });

  return (
    <div className="p-4">
      <SettingsToolbar ref={tableRef} filter={{ globalFilter, setGlobalFilter }} type="documents" />
      <DataTable
        ref={tableRef}
        dataKey="id"
        editMode="cell"
        filterDisplay="menu"
        onSelectionChange={(e) => setSelected(e.value)}
        removableSort
        selection={selected}
        selectionMode="checkbox"
        showGridlines
        size="small"
        sortMode="multiple"
        value={documents}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column editor={(e) => TitleEditor(e, updateDocument)} field="title" header="Title" sortable />
        <Column align="center" body={IconColumn} className="w-24" field="icon" header="Icon" />
        <Column
          align="center"
          body={ImageColumn}
          className="w-36"
          editor={(e) => ImageEditor(e, images, updateDocument)}
          field="image"
          header="Image"
        />
        <Column
          align="center"
          body={(data) => ParentColumn(data, documents)}
          className="w-48"
          field="parent"
          header="Parent"
          sortable
          sortField="parent"
        />
        <Column
          align="center"
          body={(data) => TagsColumn(data)}
          editor={(e) => TagsEditor(e, updateDocument, refetchTags)}
          field="tags"
          header="Tags"
          sortable
          sortField="tags"
        />
        <Column
          align="center"
          body={(data) => FolderTemplatePublicColumn(data, "folder")}
          className="w-10"
          field="folder"
          header="Folder"
          sortable
        />
        <Column
          align="center"
          body={(data) => FolderTemplatePublicColumn(data, "template")}
          className="w-10"
          field="template"
          header="Template"
          sortable
        />
        <Column
          align="center"
          body={(data) => FolderTemplatePublicColumn(data, "isPublic")}
          className="w-10"
          field="isPublic"
          header="Public"
          sortable
        />
      </DataTable>
    </div>
  );
}
