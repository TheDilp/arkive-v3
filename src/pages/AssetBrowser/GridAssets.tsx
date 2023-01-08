import { useVirtualizer } from "@tanstack/react-virtual";
import { MutableRefObject, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllImages, useGetAllSettingsImages } from "../../CRUD/ItemsCRUD";
import GridItem from "./GridItem";

type Props = { images: ImageProps[] };

export default function GridAssets() {
  const parentRef = useRef() as MutableRefObject<HTMLDivElement>;
  const { project_id } = useParams();
  const { data: images } = useGetAllSettingsImages(project_id as string);
  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(images?.length || 6 / 6),
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 30, []),
    overscan: 5,
  });
  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: 6,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 30, []),
    overscan: 5,
  });

  //   useEffect(() => {
  //     setFilteredImages(images.filter((image: ImageProps) => image.title.includes(filter)));
  //   }, [filter]);

  return (
    <div
      className="justify-content-center align-items-start flex w-full"
      style={{
        height: "90vh",
      }}>
      <div
        ref={parentRef}
        className="justify-content-evenly flex w-10"
        style={{
          height: "100%",
          width: "100%",
          overflow: "auto",
        }}>
        <div
          className="w-full "
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
                  className="flex justify-center"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${virtualColumn.size}px`,
                    height: `${virtualRow.size}px`,
                    transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                  }}>
                  {(images || [])[virtualRow.index * 5 + virtualColumn.index] && "TEST"}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
