import { Icon } from "@iconify/react";
import React, { useCallback, useRef } from "react";
import { useVirtual } from "react-virtual";
import { iconSelect } from "../../../custom-types";
import { iconList } from "../../../utils/iconsList";
interface iconSelectMenu extends iconSelect {
  setIconSelect: (iconSelect: iconSelect) => void;
}
export default function IconSelectMenu({
  doc_id,
  icon,
  top,
  left,
  show,
  setIconSelect,
}: iconSelectMenu) {
  const parentRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const rowVirtualizer = useVirtual({
    size: Math.ceil(iconList.length / 6),
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
  return (
    <div
      className="absolute surface-100 z-5 w-13rem  h-20rem"
      style={{
        left,
        top,
      }}
    >
      <div ref={parentRef} className="List w-full h-full overflow-auto">
        <div
          style={{
            width: "100%",
            height: `${rowVirtualizer.totalSize}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) => (
            <React.Fragment key={virtualRow.index}>
              {columnVirtualizer.virtualItems.map((virtualColumn) => (
                <div
                  key={virtualColumn.index}
                  className="mx-2 justify-content-center"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${virtualColumn.size}px`,
                    height: `${virtualRow.size}px`,
                    transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                  }}
                >
                  <Icon
                    className="mx-auto hover:text-blue-300 cursor-pointer"
                    onClick={() => {
                      setIconSelect({
                        doc_id,
                        icon: "",
                        top: 0,
                        left: 0,
                        show: false,
                      });
                    }}
                    fontSize={30}
                    icon={`mdi:${
                      iconList[virtualRow.index * 6 + virtualColumn.index]
                    }`}
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
