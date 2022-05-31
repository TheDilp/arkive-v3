import { Icon } from "@iconify/react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import React, { useCallback, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useVirtual } from "react-virtual";
import { DocumentProps } from "../../../custom-types";
import { ProjectContext } from "../../Context/ProjectContext";

type Props = {
  filteredTree: NodeModel<DocumentProps>[];
};

export default function DocumentsFilterList({ filteredTree }: Props) {
  const parentRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const { id: docId, setId: setDocId } = useContext(ProjectContext);
  const rowVirtualizer = useVirtual({
    size: filteredTree.length,
    parentRef,
    estimateSize: useCallback(() => 31, []),
    overscan: 5,
  });
  const navigate = useNavigate();

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
                setDocId(filteredTree[virtualRow.index].id as string);
                navigate(`doc/${filteredTree[virtualRow.index].id}`);
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
                  icon={filteredTree[virtualRow.index].data?.icon as string}
                  inline={true}
                  className="mr-1"
                  onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              )}
              <span
                className={`text-md hover:bg-blue-300 Lato white-space-nowrap overflow-hidden text-overflow-ellipsis ${
                  filteredTree[virtualRow.index].id === docId
                    ? "text-primary"
                    : ""
                }`}
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
