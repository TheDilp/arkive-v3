import { ToggleButton } from "primereact/togglebutton";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import FolderCard from "../../components/Folder/FolderCard";
import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";
import { getIcon, getType } from "../../utils/transform";

function FolderViewCards({ type, items }: { type: AvailableItemTypes; items: AllItemsType[] }) {
  return (
    <div className="flex flex-wrap">
      {items.map((item: AllItemsType) => (
        <FolderCard key={item.id} icon={getIcon(type, item)} id={item.id} isFolder={item.folder} title={item.title} />
      ))}
    </div>
  );
}

export default function FolderView() {
  const { project_id, item_id } = useParams();
  const { pathname } = useLocation();
  const [view, setView] = useState(false);
  const type = getType(pathname);
  const { data, isLoading, isError } = useGetAllItems(project_id as string, type);

  if (isLoading || isError) return null;

  const currentItems = data.filter((item) => {
    if (item_id) return item.parent === item_id;
    return !item.parent;
  });

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="w-full">
        <ToggleButton checked={view} offLabel="Table View" onChange={(e) => setView(e.value)} onLabel="Card View" />
      </div>
      <FolderViewCards items={currentItems} type={type} />
    </div>
  );
}
