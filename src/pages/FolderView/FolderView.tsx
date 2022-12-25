import { useAtom } from "jotai";
import { MutableRefObject, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import FolderCard from "../../components/Folder/FolderCard";
import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";
import { SidebarTreeContextAtom } from "../../utils/Atoms/atoms";
import { useTreeMenuItems } from "../../utils/contextMenus";
import { getIcon, getType } from "../../utils/transform";

function FolderViewCards({ type, items }: { type: AvailableItemTypes; items: AllItemsType[] }) {
  const { project_id } = useParams();

  const cm = useRef() as MutableRefObject<any>;
  const [contextMenu] = useAtom(SidebarTreeContextAtom);

  const menuItems = useTreeMenuItems(contextMenu, type, project_id as string);
  return (
    <div className="flex flex-wrap">
      <ContextMenu cm={cm} items={menuItems} />

      {items?.length ? (
        items
          .sort((a, b) => a.sort - b.sort)
          .map((item: AllItemsType) => (
            <FolderCard
              key={item.id}
              cm={cm}
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

  if (isLoading || isError) return null;

  return (
    <div className="flex flex-col gap-4 px-8">
      <Breadcrumbs type={type} />
      <FolderViewCards
        items={data.filter((item) => {
          if (item_id) return item.parentId === item_id;
          return !item.parentId;
        })}
        type={type}
      />
    </div>
  );
}
