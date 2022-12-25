import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useParams } from "react-router-dom";

import { IconSelect } from "../../components/IconSelect/IconSelect";
import { useGetAllItems, useUpdateItem } from "../../CRUD/ItemsCRUD";
import { DocumentType } from "../../types/documentTypes";
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
      <Icon className="cursor-pointer rounded-full hover:bg-sky-400" icon={icon || "mdi:file"} inline fontSize={24} />
    </IconSelect>
  );
}

export default function DocumentSettings({}: Props) {
  const { project_id } = useParams();
  const { data: documents } = useGetAllItems(project_id as string, "documents") as { data: DocumentType[] };

  return (
    <div>
      <DataTable responsiveLayout="scroll" value={documents.filter((doc) => !doc.folder && !doc.template)}>
        <Column field="title" header="title" />
        <Column body={IconColumn} field="icon" header="Icon" />
        <Column field="image" header="Image" />
      </DataTable>
    </div>
  );
}
