import { useParams } from "react-router-dom";

import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { DocumentType } from "../../types/documentTypes";

export default function FolderView() {
  const { project_id, item_id } = useParams();
  const { data, isLoading, isError } = useGetAllItems(project_id as string, "documents");

  if (isLoading || isError) return null;

  const currentItems = data.filter((item) => {
    if (item_id) return item.parent === item_id;
    return !item.parent;
  });

  console.log(currentItems);

  return <div>FolderView</div>;
}
