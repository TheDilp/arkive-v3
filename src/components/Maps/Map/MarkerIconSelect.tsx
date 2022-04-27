import { Icon } from "@iconify/react";
import { InputText } from "primereact/inputtext";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";
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
  const [search, setSearch] = useState<string | null>(null);

  const rowVirtualizer = useVirtual({
    size: Math.ceil(
      iconList.filter((icon) =>
        search ? icon.startsWith(search.toLowerCase()) : true
      ).length / 6
    ),
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
        <InputText
          type="text"
          className="w-full py-0 mb-2"
          placeholder="Search icons"
          onChange={(e) => setSearch(e.target.value)}
        />
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
                  title={`${
                    iconList[virtualRow.index * 6 + virtualColumn.index]
                  }`}
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
