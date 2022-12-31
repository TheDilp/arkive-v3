import { useAtom } from "jotai";
import { MutableRefObject, useRef } from "react";
import { useParams } from "react-router-dom";

import ContextMenu from "../../components/ContextMenu/ContextMenu";
import FolderCard from "../../components/Folder/FolderCard";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";
import { SidebarTreeContextAtom } from "../../utils/Atoms/atoms";
import { useTreeMenuItems } from "../../utils/contextMenus";
import { getIcon } from "../../utils/transform";

export function FolderViewCards({ type, items }: { type: AvailableItemTypes; items: AllItemsType[] }) {
  const { project_id } = useParams();

  const cm = useRef() as MutableRefObject<any>;
  const [contextMenu] = useAtom(SidebarTreeContextAtom);

  const menuItems = useTreeMenuItems(contextMenu, type, project_id as string);
  return (
    <div className="flex max-h-96 flex-1 flex-wrap ">
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
