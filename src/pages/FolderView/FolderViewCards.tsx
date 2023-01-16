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
  // const rowVirtualizer = useVirtualizer({
  //   count: Math.ceil(items.length / count),
  //   getScrollElement: () => parentRef.current,
  //   // Height of individual row
  //   estimateSize: () => 144,
  //   overscan: 10,
  // });

  // const columnVirtualizer = useVirtualizer({
  //   horizontal: true,
  //   count,
  //   getScrollElement: () => parentRef.current,
  //   // Width of individual column
  //   estimateSize: () => 120,
  //   overscan: 5,
  // });

  return (
    <div className="flex h-[92%] flex-col ">
      <ContextMenu cm={cm} items={menuItems} />
      <div className="flex flex-wrap overflow-auto">
        {items.length
          ? items.map((item) => (
              <FolderCard
                key={item.id}
                cm={cm}
                icon={getIcon(type, item)}
                id={item.id}
                // @ts-ignore
                image={item?.image || undefined}
                isFolder={item.folder}
                title={item.title}
                type={type}
              />
            ))
          : null}
      </div>

      {/* <div ref={parentRef} className="h-[90%] w-full overflow-auto">

// USE THIS TO ACCESS INDIVIDUAL ITEM
      [virtualRow.index * count + virtualColumn.index]
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
                 
                </div>
              ))}
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
