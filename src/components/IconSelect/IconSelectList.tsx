import { Icon } from "@iconify/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { InputText } from "primereact/inputtext";
import { TabMenu } from "primereact/tabmenu";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { IconSelectMenuType } from "../../types/generalTypes";
import { getIconsList } from "../../utils/iconsList";
import { getTabForIconSelect } from "../../utils/uiUtils";

export default function IconSelectList({ close, setIcon, iconTypes }: IconSelectMenuType) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState<string | null>(null);
  const [icons, setIcons] = useState(getIconsList(iconTypes[activeIndex]));
  const [filteredIconList, setFilteredIconList] = useState(icons);
  const parentRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(icons.filter((icon) => (search ? icon.includes(search.toLowerCase()) : true)).length / 6),
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 30, []),
    overscan: 1,
  });
  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: 6,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 40, []),
    overscan: 5,
  });
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    const newIcons = getIconsList(iconTypes[activeIndex]);
    setIcons(newIcons);
    setFilteredIconList(newIcons);
    setSearch(null);
  }, [activeIndex]);

  useEffect(() => {
    setFilteredIconList(icons.filter((icon) => (search ? icon.includes(search.toLowerCase()) : true)));
  }, [search]);
  return (
    <div ref={ref} className="h-96 w-64 rounded-sm bg-zinc-900">
      <TabMenu
        activeIndex={activeIndex}
        className="w-full"
        model={getTabForIconSelect(iconTypes)}
        onTabChange={(e) => setActiveIndex(e.index)}
      />
      <div ref={parentRef} className="max-h-80 w-full overflow-auto">
        <InputText
          autoFocus
          className="p-inputtext-sm sticky top-0 z-10 mb-2 w-full py-1"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search icons"
          type="text"
        />

        <div
          style={{
            width: "100%",
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <React.Fragment key={virtualRow.index}>
              {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
                <div
                  key={virtualColumn.index}
                  className="justify-content-center mx-2"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${virtualColumn.size}px`,
                    height: `${virtualRow.size}px`,
                    transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                  }}>
                  <Icon
                    className="mx-auto cursor-pointer hover:text-blue-300"
                    fontSize={30}
                    icon={`${filteredIconList[virtualRow.index * 6 + virtualColumn.index]}`}
                    onClick={() => {
                      setIcon(filteredIconList[virtualRow.index * 6 + virtualColumn.index]);
                      close();
                    }}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
