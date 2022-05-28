import { Icon } from "@iconify/react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import React, { useCallback, useRef } from "react";
import { useVirtual } from "react-virtual";
import { MapProps } from "../../../custom-types";

type Props = {
  filteredTree: NodeModel<MapProps>[];
  setMapId: (mapId: string) => void;
};

export default function MapsFilterList({ filteredTree, setMapId }: Props) {
  const parentRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const rowVirtualizer = useVirtual({
    size: filteredTree.length,
    parentRef,
    estimateSize: useCallback(() => 31, []),
    overscan: 5,
  });
  return (
    <>
      <div
        ref={parentRef}
        className="h-screen list-none text-md"
        style={{
          height: `100%`,
          width: `100%`,
          overflow: "auto",
          paddingLeft: 40,
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.totalSize}px`,
            width: "100%",
            position: "relative",
            marginTop: "16px",
          }}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) => (
            <div
              key={virtualRow.index}
              className="hover:bg-primary cursor-pointer Lato flex align-items-center"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `31px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              onClick={() => {
                setMapId(filteredTree[virtualRow.index].id as string);
              }}
            >
              {filteredTree[virtualRow.index].droppable ? (
                <Icon
                  icon="bxs:folder"
                  inline={true}
                  className="mr-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              ) : (
                <Icon
                  icon={"mdi:map"}
                  inline={true}
                  className="mr-1"
                  onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              )}
              <span
                className={`text-lg hover:bg-blue-300 Lato white-space-nowrap overflow-hidden text-overflow-ellipsis`}
              >
                {filteredTree[virtualRow.index].text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
