import { Icon } from "@iconify/react";
import { useCallback, useRef } from "react";
import { useVirtual } from "react-virtual";
import { iconSelect } from "../../../custom-types";
import { iconList } from "../../../utils/iconsList";
export default function IconSelectMenu({
  doc_id,
  icon,
  top,
  left,
  show,
}: iconSelect) {
  const parentRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const rowVirtualizer = useVirtual({
    size: Math.ceil(iconList.length / 6),
    parentRef,
    estimateSize: useCallback(() => 35, []),
    overscan: 5,
  });

  const columnVirtualizer = useVirtual({
    horizontal: true,
    size: 6,
    parentRef,
    estimateSize: useCallback(() => 35, []),
    overscan: 5,
  });
  return (
    <div
      className="absolute surface-100 z-5  h-20rem"
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
            <div key={virtualRow.index}>
              {columnVirtualizer.virtualItems.map((virtualColumn) => (
                <span
                  key={virtualColumn.index}
                  className="px-2"
                  style={{
                    position: "relative",
                    top: 0,
                    left: 0,
                    width: `${virtualColumn.size}px`,
                    height: `${virtualRow.size}px`,
                    transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                  }}
                >
                  <Icon
                    fontSize={30}
                    icon={`mdi:${
                      iconList[virtualRow.index * 6 + virtualColumn.index]
                    }`}
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
