import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
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
import { getImageLink } from "../../utils/CRUD/CRUDUrls";
import { toaster } from "../../utils/toast";

type Props = {};

function IconColumn({ id, icon }: DocumentType) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const updateDocumentMutation = useUpdateItem("documents");
  return (
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
  );
}
function ImageColumn({ image }: DocumentType) {
  const { project_id } = useParams();
  return image ? (
    <div className="w-12">
      <img alt={image || "column"} className="object-contain" src={getImageLink(image, project_id as string)} />
    </div>
  ) : null;
}
function ImageEditor(editorOptions: ColumnEditorOptions, images: string[] | undefined) {
  const { rowData } = editorOptions as { rowData: DocumentType };
  return (
    <div className="w-36">
      <Dropdown
        className="w-full"
        itemTemplate={ImageDropdownItem}
        // onChange={(e) => handleChange({ name: "image", value: e.value === "None" ? undefined : e.value })}
        options={["None", ...(images || [])] || []}
        placeholder="Select map"
        value={rowData?.image}
        valueTemplate={ImageDropdownValue({ image: rowData?.image })}
      />
    </div>
  );
}

export default function DocumentSettings({}: Props) {
  const { project_id } = useParams();

  const [selected, setSelected] = useState([]);

  const { data: documents } = useGetAllItems(project_id as string, "documents") as { data: DocumentType[] };
  const { data: images } = useGetAllImages(project_id as string);

  return (
    <div>
      <DataTable
        dataKey="id"
        onSelectionChange={(e) => setSelected(e.value)}
        selection={selected}
        showGridlines
        value={documents.filter((doc) => !doc.folder && !doc.template)}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column field="title" header="Title" />
        <Column body={IconColumn} className="w-24" field="icon" header="Icon" />
        <Column body={ImageColumn} className="w-36" editor={(e) => ImageEditor(e, images)} field="image" header="Image" />
      </DataTable>
    </div>
  );
}
