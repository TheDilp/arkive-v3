import { useAtomValue } from "jotai";
import { MutableRefObject, useRef } from "react";
import { useParams } from "react-router-dom";

import FolderCard from "../../components/Card/FolderCard";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";
import { SidebarTreeContextAtom } from "../../utils/Atoms/atoms";
import { useTreeMenuItems } from "../../utils/contextMenus";
import { getIcon } from "../../utils/transform";
import { getCDNImage } from "../../utils/uiUtils";

export function FolderViewCards({ type, items }: { type: AvailableItemTypes; items: AllItemsType[] }) {
  const { project_id } = useParams();

  const cm = useRef() as MutableRefObject<any>;
  const contextMenu = useAtomValue(SidebarTreeContextAtom);
  const menuItems = useTreeMenuItems(contextMenu, type, project_id as string);
  return (
    <div className="flex h-[90%] flex-col">
      <ContextMenu cm={cm} items={menuItems} />
      <div className="flex h-full flex-1 flex-wrap content-start gap-y-4 overflow-auto">
        {items.length
          ? items.map((item) => (
              <FolderCard
                key={item.id}
                cm={cm}
                icon={getIcon(type, item)}
                id={item.id}
                // @ts-ignore
                image={item?.image ? getCDNImage(item?.image) : undefined}
                isFolder={item.folder}
                isPublic={item.isPublic}
                title={item.title}
                type={type}
              />
            ))
          : "There is no content."}
      </div>
    </div>
  );
}
