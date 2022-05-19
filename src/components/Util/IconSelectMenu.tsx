import { Icon } from "@iconify/react";
import { InputText } from "primereact/inputtext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useVirtual } from "react-virtual";
import { iconSelectProps } from "../../custom-types";
import { useOnClickOutside, useUpdateDocument } from "../../utils/customHooks";
import { iconList } from "../../utils/iconsList";
interface iconSelectMenu extends iconSelectProps {
  setIconSelect: (iconSelect: iconSelectProps) => void;
  closeEdit?: () => void;
}
export default function IconSelectMenu({
  id,
  top,
  left,
  show,
  closeEdit,
  setIconSelect,
}: iconSelectMenu) {
  const { project_id } = useParams();
  const [search, setSearch] = useState<string | null>(null);
  const [filteredIconList, setFilteredIconList] = useState(iconList);
  const parentRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const rowVirtualizer = useVirtual({
    size: Math.round(
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
  const iconMutation = useUpdateDocument(project_id as string);
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;
  useOnClickOutside(ref, () =>
    setIconSelect({ id: "", icon: "", top: 0, left: 0, show: false })
  );
  useEffect(() => {
    setFilteredIconList(
      iconList.filter((icon) =>
        search ? icon.startsWith(search.toLowerCase()) : true
      )
    );
  }, [search]);
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
          className="w-full py-1 mb-2"
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
                >
                  <Icon
                    className="mx-auto hover:text-blue-300 cursor-pointer"
                    onClick={() => {
                      if (closeEdit) closeEdit();
                      iconMutation.mutate({
                        id,
                        icon: `mdi:${
                          filteredIconList[
                            virtualRow.index * 6 + virtualColumn.index
                          ]
                        }`,
                      });
                      setIconSelect({
                        id,
                        icon: "",
                        top: 0,
                        left: 0,
                        show: false,
                      });
                    }}
                    fontSize={30}
                    icon={`mdi:${
                      filteredIconList[
                        virtualRow.index * 6 + virtualColumn.index
                      ]
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
