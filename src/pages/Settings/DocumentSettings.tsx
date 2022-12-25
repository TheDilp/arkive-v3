import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "primereact/checkbox";
import { Column, ColumnEditorOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { ImageDropdownItem } from "../../components/Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../../components/Dropdown/ImageDropdownValue";
import { IconSelect } from "../../components/IconSelect/IconSelect";
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

function TitleEditor(editorOptions: ColumnEditorOptions, updateDocument: any) {
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
    <div className="flex h-8 w-full justify-center">
      <img alt={image || "column"} className="object-contain" src={getImageLink(image, project_id as string)} />
    </div>
  ) : null;
}
function ImageEditor(editorOptions: ColumnEditorOptions, images: string[] | undefined, updateDocument: any) {
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

export default function DocumentSettings() {
  const { project_id } = useParams();

  const [selected, setSelected] = useState([]);
  const { mutate } = useUpdateItem("documents");
  const queryClient = useQueryClient();

  const updateDocument = (data: Partial<DocumentType>) =>
    mutate(data, {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["allItems", project_id, "documents"] });
        toaster("success", "Item updated successfully.");
      },
    });

  const { data: documents } = useGetAllItems(project_id as string, "documents") as { data: DocumentType[] };
  const { data: images } = useGetAllImages(project_id as string);

  return (
    <div className="p-4">
      <SettingsToolbar />
      <DataTable
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
        <Column editor={(e) => TitleEditor(e, updateDocument)} field="title" header="Title" />
        <Column align="center" body={IconColumn} className="w-24" field="icon" header="Icon" />
        <Column
          align="center"
          body={ImageColumn}
          className="w-36"
          editor={(e) => ImageEditor(e, images, updateDocument)}
          field="image"
          header="Image"
        />
        <Column align="center" body={(data) => ParentColumn(data, documents)} className="w-48" field="parent" header="Parent" />
        <Column
          align="center"
          body={(data) => FolderTemplatePublicColumn(data, "folder")}
          className="w-10"
          field="folder"
          header="Folder"
        />
        <Column
          align="center"
          body={(data) => FolderTemplatePublicColumn(data, "template")}
          className="w-10"
          field="template"
          header="Template"
        />
        <Column
          align="center"
          body={(data) => FolderTemplatePublicColumn(data, "isPublic")}
          className="w-10"
          field="public"
          header="Public"
        />
      </DataTable>
    </div>
  );
}
