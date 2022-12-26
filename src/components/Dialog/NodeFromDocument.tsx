import { useParams } from "react-router-dom";

import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { FolderViewCards } from "../../pages/FolderView/FolderViewCards";
import { DocumentType } from "../../types/documentTypes";

export default function NodeFromDocument() {
  const { project_id } = useParams();
  const { data: allDocuments } = useGetAllItems(project_id as string, "documents") as { data: DocumentType[] };
  return (
    <div className="max-w-md">
      <FolderViewCards items={allDocuments || []} type="documents" />
    </div>
  );
}
