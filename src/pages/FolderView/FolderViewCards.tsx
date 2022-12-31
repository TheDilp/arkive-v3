import { useAtom } from "jotai";
import { Fragment, MutableRefObject, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useVirtual } from "react-virtual";

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

  const rowVirtualizer = useVirtual({
    size: Math.ceil(items.length / 5),
    parentRef,
    estimateSize: useCallback(() => 200, []),
    overscan: 5,
  });

  const columnVirtualizer = useVirtual({
    horizontal: true,
    size: 5,
    parentRef,
    estimateSize: useCallback(() => 285, []),
    overscan: 5,
  });

  return (
    <div className="flex">
      <ContextMenu cm={cm} items={menuItems} />

      <div ref={parentRef} className="h-[98vh] w-full overflow-auto">
        <div
          style={{
            height: `${rowVirtualizer.totalSize}px`,
            width: `${columnVirtualizer.totalSize}px`,
            position: "relative",
          }}>
          {rowVirtualizer.virtualItems.map((virtualRow) => (
            <Fragment key={virtualRow.index}>
              {columnVirtualizer.virtualItems.map((virtualColumn) => {
                if (items[virtualRow.index * 5 + virtualColumn.index])
                  return (
                    <div
                      key={virtualColumn.index}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: `9rem`,
                        height: `9rem`,
                        transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                      }}>
                      <FolderCard
                        key={items[virtualRow.index * 5 + virtualColumn.index].id}
                        cm={cm}
                        icon={getIcon(type, items[virtualRow.index * 5 + virtualColumn.index])}
                        id={items[virtualRow.index * 5 + virtualColumn.index].id}
                        image={
                          "image" in items[virtualRow.index * 5 + virtualColumn.index]
                            ? // @ts-ignore
                              items[virtualRow.index * 5 + virtualColumn.index]?.image
                            : undefined
                        }
                        isFolder={items[virtualRow.index * 5 + virtualColumn.index].folder}
                        title={items[virtualRow.index * 5 + virtualColumn.index].title}
                        type={type}
                      />
                    </div>
                  );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      {/* 
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
      )} */}
    </div>
  );
}
