import { useParams } from "react-router-dom";

import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { DocumentType } from "../../types/documentTypes";

type Props = {};

export default function FolderView({}: Props) {
  const { project_id, item_id } = useParams();
  const documents = useGetAllItems(project_id, "documents") as DocumentType[];
  return <div>FolderView</div>;
}
