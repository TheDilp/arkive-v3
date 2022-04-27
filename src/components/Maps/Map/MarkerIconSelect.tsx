import { Icon } from "@iconify/react";
import React, { Dispatch, SetStateAction, useCallback, useRef } from "react";
import { useVirtual } from "react-virtual";
import { useOnClickOutside } from "../../../utils/customHooks";
import { iconList } from "../../../utils/iconsList";

type Props = {
  top: number;
  left: number;
  show: boolean;
  setIconSelect: Dispatch<
    SetStateAction<{
      show: boolean;
      top: number;
      left: number;
    }>
  >;
  setValue: (name: "icon", value: string, config?: Object) => void;
};

export default function CreateMarkerIconSelect({
  top,
  left,
  show,
  setIconSelect,
  setValue,
}: Props) {
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;
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
  useOnClickOutside(ref, () => {});
  return (
    <div
      ref={ref}
      className="fixed surface-100 z-5 w-13rem  h-20rem"
      style={{
        left,
        top,
        display: show ? "block" : "none",
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
                      setValue(
                        "icon",
                        `${
                          iconList[virtualRow.index * 6 + virtualColumn.index]
                        }`
                      );
                      setIconSelect({
                        show: false,
                        top: 0,
                        left: 0,
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
