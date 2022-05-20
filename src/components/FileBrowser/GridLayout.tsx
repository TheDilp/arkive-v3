import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useVirtual } from "react-virtual";
import { ImageProps } from "../../custom-types";

import GridItem from "./GridItem";

type Props = { images: ImageProps[]; filter: string };

export default function GridLayout({ images, filter }: Props) {
  const parentRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [filteredImages, setFilteredImages] = useState(images);
  const rowVirtualizer = useVirtual({
    size: Math.ceil(filteredImages.length / 5),
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

  useEffect(() => {
    setFilteredImages(
      images.filter((image: ImageProps) => image.title.includes(filter))
    );
  }, [filter]);

  return (
    <div
      className="w-full flex justify-content-center align-items-start"
      style={{
        height: "90vh",
      }}
    >
      <div
        ref={parentRef}
        className="w-10 flex justify-content-evenly"
        style={{
          height: `100%`,
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
                  {filteredImages[
                    virtualRow.index * 5 + virtualColumn.index
                  ] && (
                    <GridItem
                      name={
                        filteredImages[
                          virtualRow.index * 5 + virtualColumn.index
                        ]?.title || ""
                      }
                      link={
                        filteredImages[
                          virtualRow.index * 5 + virtualColumn.index
                        ]?.link || ""
                      }
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
