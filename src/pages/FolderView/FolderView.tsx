import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import FolderCard from "../../components/Folder/FolderCard";
import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";
import { getIcon, getType } from "../../utils/transform";

function FolderViewCards({ type, items }: { type: AvailableItemTypes; items: AllItemsType[] }) {
  return (
    <div className="flex flex-wrap">
      {items?.length ? (
        items.map((item: AllItemsType) => (
          <FolderCard
            key={item.id}
            icon={getIcon(type, item)}
            id={item.id}
            image={"image" in item ? item?.image : undefined}
            isFolder={item.folder}
            title={item.title}
            type={type}
          />
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
  useEffect(() => {
    console.log(data);
  }, [data]);
  if (isLoading || isError) return null;

  return (
    <div className="flex flex-col gap-4 px-8">
      <Breadcrumbs type={type} />
      <FolderViewCards
        items={data.filter((item) => {
          if (item_id) return item.parent === item_id;
          return !item.parent;
        })}
        type={type}
      />
    </div>
  );
}
