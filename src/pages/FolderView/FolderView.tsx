import { useLocation, useParams } from "react-router-dom";

import FolderCard from "../../components/Folder/FolderCard";
import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";
import { getIcon, getType } from "../../utils/transform";

function FolderViewCards({ type, items }: { type: AvailableItemTypes; items: AllItemsType[] }) {
  return (
    <div className="flex flex-wrap">
      {items?.length ? (
        items.map((item: AllItemsType) => (
          <FolderCard key={item.id} icon={getIcon(type, item)} id={item.id} isFolder={item.folder} title={item.title} />
        ))
      ) : (
        <div className="text-zinc-600">No items in this folder.</div>
      )}
    </div>
  );
}

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

  return (
    <div className="flex flex-col gap-4 p-8">
      <FolderViewCards items={currentItems} type={type} />
    </div>
  );
}
