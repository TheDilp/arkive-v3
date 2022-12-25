import { Icon } from "@iconify/react";
import { UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "primereact/checkbox";
import { Column, ColumnEditorOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { ImageDropdownItem } from "../../components/Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../../components/Dropdown/ImageDropdownValue";
import { IconSelect } from "../../components/IconSelect/IconSelect";
import { useGetAllImages, useGetAllItems, useUpdateItem } from "../../CRUD/ItemsCRUD";
import { DocumentType } from "../../types/documentTypes";
import { AllItemsType } from "../../types/generalTypes";
import { getImageLink } from "../../utils/CRUD/CRUDUrls";
import { toaster } from "../../utils/toast";

function IconColumn({ id, icon }: DocumentType) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const updateDocumentMutation = useUpdateItem("documents");
  return (
    <div className="flex justify-center">
      <IconSelect
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
        <Icon className="cursor-pointer rounded-full hover:bg-sky-400" fontSize={24} icon={icon || "mdi:file"} inline />
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
function ImageEditor(
  editorOptions: ColumnEditorOptions,
  images: string[] | undefined,
  updateDocumentMutation: UseMutationResult<
    Response | null,
    unknown,
    Partial<AllItemsType>,
    {
      oldData: unknown;
    }
  >,
) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const { rowData } = editorOptions as { rowData: DocumentType };
  return (
    <div className="w-36">
      <Dropdown
        className="w-full"
        itemTemplate={ImageDropdownItem}
        onChange={(e) =>
          updateDocumentMutation.mutate(
            { id: rowData.id, image: e.value === "None" ? undefined : e.value },
            {
              onSuccess: () => {
                queryClient.refetchQueries({ queryKey: ["allItems", project_id, "documents"] });
                toaster("success", "Icon updated successfully.");
              },
            },
          )
        }
        options={["None", ...(images || [])] || []}
        placeholder="Select map"
        value={rowData?.image}
        valueTemplate={ImageDropdownValue({ image: rowData?.image })}
      />
    </div>
  );
}

function FolderTemplateColumn({ id, folder, template }: DocumentType, type: "folder" | "template") {
  const { project_id } = useParams();
  const updateDocumentMutation = useUpdateItem("documents");
  const queryClient = useQueryClient();

  return (
    <Checkbox
      checked={type === "folder" ? folder : template}
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
  if (parentFolder) return <div className="w-24">{parentFolder.title}</div>;
  return null;
}

export default function DocumentSettings() {
  const { project_id } = useParams();

  const [selected, setSelected] = useState([]);
  const updateDocumentMutation = useUpdateItem("documents");

  const { data: documents } = useGetAllItems(project_id as string, "documents") as { data: DocumentType[] };
  const { data: images } = useGetAllImages(project_id as string);

  return (
    <div>
      <DataTable
        dataKey="id"
        onSelectionChange={(e) => setSelected(e.value)}
        selection={selected}
        showGridlines
        value={documents}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column field="title" header="Title" />
        <Column align="center" body={IconColumn} className="w-24" field="icon" header="Icon" />
        <Column
          align="center"
          body={ImageColumn}
          className="w-36"
          editor={(e) => ImageEditor(e, images, updateDocumentMutation)}
          field="image"
          header="Image"
        />
        <Column
          align="center"
          body={(data) => FolderTemplateColumn(data, "folder")}
          className="w-10"
          field="folder"
          header="Folder"
        />
        <Column align="center" body={(data) => ParentColumn(data, documents)} className="w-10" field="parent" header="Parent" />
        <Column
          align="center"
          body={(data) => FolderTemplateColumn(data, "template")}
          className="w-10"
          field="template"
          header="Template"
        />
      </DataTable>
    </div>
  );
}
