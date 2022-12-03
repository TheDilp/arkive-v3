import { Icon } from "@iconify/react";
import { InputText } from "primereact/inputtext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useVirtual } from "react-virtual";

import { IconSelectMenuType } from "../../types/generalTypes";
import { iconList } from "../../utils/iconsList";

export default function IconSelectList({ close, setIcon }: IconSelectMenuType) {
  const [search, setSearch] = useState<string | null>(null);
  const [filteredIconList, setFilteredIconList] = useState(iconList);
  const parentRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const rowVirtualizer = useVirtual({
    size: Math.ceil(iconList.filter((icon) => (search ? icon.includes(search.toLowerCase()) : true)).length / 6),
    parentRef,
    estimateSize: useCallback(() => 30, []),
    overscan: 5,
  });
  const columnVirtualizer = useVirtual({
    horizontal: true,
    size: 6,
    parentRef,
    estimateSize: useCallback(() => 30, []),
    overscan: 5,
  });
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    setFilteredIconList(iconList.filter((icon) => (search ? icon.includes(search.toLowerCase()) : true)));
  }, [search]);

  return (
    <div ref={ref} className="h-80 w-52 rounded-sm bg-zinc-800">
      <div ref={parentRef} className="h-full w-full overflow-auto">
        <InputText
          className="mb-2 w-full py-1"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search icons"
          type="text"
        />
        <div
          style={{
            width: "100%",
            height: `${rowVirtualizer.totalSize}px`,
            position: "relative",
          }}>
          {rowVirtualizer.virtualItems.map((virtualRow) => (
            <React.Fragment key={virtualRow.index}>
              {columnVirtualizer.virtualItems.map((virtualColumn) => (
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
