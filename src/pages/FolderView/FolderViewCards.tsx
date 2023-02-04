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
    <div className="flex h-full flex-col">
      <ContextMenu cm={cm} items={menuItems} />
      <div className="flex h-full flex-1 flex-wrap content-start gap-y-4 overflow-auto">
        {items.length
          ? items.map((item) => (
              <FolderCard
                key={item.id}
                cm={cm}
                icon={getIcon(type, item)}
                id={item.id}
                image={"image" in item ? item?.image : undefined}
                isFolder={item.folder}
                isPublic={item?.isPublic}
                title={item.title}
                type={type}
              />
            ))
          : null}
      </div>
    </div>
  );
}
