import { useVirtualizer } from "@tanstack/react-virtual";
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

  const parentRef = useRef() as MutableRefObject<HTMLDivElement>;
  const cm = useRef() as MutableRefObject<any>;
  const [contextMenu] = useAtom(SidebarTreeContextAtom);

  const menuItems = useTreeMenuItems(contextMenu, type, project_id as string);
  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(items.length / 5),
    getScrollElement: () => parentRef.current,
    // Height of individual row
    estimateSize: () => 144,
    overscan: 5,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: 5,
    getScrollElement: () => parentRef.current,
    // Width of individual column
    estimateSize: () => 250,
    overscan: 5,
  });

  return (
    <div className="h-screen overflow-hidden">
      <ContextMenu cm={cm} items={menuItems} />

      <div ref={parentRef} className="h-[90%] w-full overflow-auto">
        <div
          className="flex w-full gap-1"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: `${columnVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div key={virtualRow.index}>
              {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
                <div
                  key={virtualColumn.index}
                  className={` 
                flex justify-center`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${virtualColumn.size}px`,
                    height: `${virtualRow.size}px`,
                    transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                  }}>
                  {items[virtualRow.index * 5 + virtualColumn.index] && (
                    <FolderCard
                      key={items[virtualRow.index * 5 + virtualColumn.index].id}
                      cm={cm}
                      icon={getIcon(type, items[virtualRow.index * 5 + virtualColumn.index])}
                      id={items[virtualRow.index * 5 + virtualColumn.index].id}
                      // @ts-ignore
                      image={items[virtualRow.index * 5 + virtualColumn.index]?.image || undefined}
                      isFolder={items[virtualRow.index * 5 + virtualColumn.index].folder}
                      title={items[virtualRow.index * 5 + virtualColumn.index].title}
                      type={type}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
