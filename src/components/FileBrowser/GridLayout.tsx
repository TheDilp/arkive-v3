import React, { MutableRefObject, useCallback, useRef } from "react";
import { useVirtual } from "react-virtual";
import { FileObject } from "../../utils/utils";
import GridItem from "./GridItem";

type Props = { images: FileObject[]; filter: string };

export default function GridLayout({ images, filter }: Props) {
  const parentRef = useRef() as MutableRefObject<HTMLDivElement>;

  const rowVirtualizer = useVirtual({
    size: Math.round(
      images.filter((image) => image.name.includes(filter)).length / 5
    ),
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
    <div
      ref={parentRef}
      className="w-10 flex justify-content-evenly"
      style={{
        height: `85%`,
        width: `100%`,
        overflow: "auto",
      }}
    >
      <div
        className="w-full "
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: `${columnVirtualizer.totalSize}px`,
          position: "relative",
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualRow) => (
          <div key={virtualRow.index}>
            {columnVirtualizer.virtualItems.map((virtualColumn) => (
              <div
                key={virtualColumn.index}
                className={` 
                flex justify-content-center${
                  virtualColumn.index % 2
                    ? virtualRow.index % 2 === 0
                      ? "ListItemOdd"
                      : "ListItemEven"
                    : virtualRow.index % 2
                    ? "ListItemOdd"
                    : "ListItemEven"
                }`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${virtualColumn.size}px`,
                  height: `${virtualRow.size}px`,
                  transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                }}
              >
                <GridItem
                  name={images[virtualRow.index * 5 + virtualColumn.index].name}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
