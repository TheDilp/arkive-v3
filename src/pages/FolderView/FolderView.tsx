import { useLocation, useParams } from "react-router-dom";

import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { getType } from "../../utils/transform";

export default function FolderView() {
  const { project_id, item_id } = useParams();
  const { pathname } = useLocation();
  const type = getType(pathname);
  const { data, isLoading, isError } = useGetAllItems(project_id as string, type);

  if (isLoading || isError) return null;

  const currentItems = data.filter((item) => {
    if (item_id) return item.parent === item_id;
    return !item.parent;
  });

  return <div>{currentItems.map((item) => item.title)}</div>;
}
