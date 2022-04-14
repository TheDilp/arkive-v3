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
    size: iconList.length,
    parentRef,
    estimateSize: useCallback(() => 35, []),
    overscan: 5,
  });
  return (
    <div
      className="absolute surface-100 z-5 w-16rem h-20rem"
      style={{
        left,
        top,
      }}
    >
      <div ref={parentRef} className="List w-full h-full overflow-auto">
        <div
          style={{
            height: `${rowVirtualizer.totalSize}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) => (
            <div
              key={virtualRow.index}
              className={virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <Icon icon={`mdi:${iconList[virtualRow.index]}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
