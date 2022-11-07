import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleProject } from "../../CRUD/ProjectCRUD";
import { TreeDataType } from "../../types/treeTypes";
import { getDepth, handleDrop } from "../../utils/tree";
import DragPreview from "../Sidebar/DragPreview";
import TreeItem from "./TreeItem";

type Props = {
  type: "documents" | "maps" | "boards" | "timelines";
};

export default function BaseTree({ type }: Props) {
  const { project_id } = useParams();

  const { isError, isLoading, data } = useGetSingleProject(
    project_id as string
  );

  if (isError) return <span>ERROR!!!</span>;
  if (isLoading) return <span>LOADING</span>;

  //! REMOVE TYPE CHECK WHEN OTHER ITEMS ARE IMPLEMENTED
  if (data && type === "documents")
    return (
      <Tree
        classes={{
          root: "w-full projectTreeRoot pr-4 pl-0 h-screen overflow-y-auto",
          container: "list-none",
          placeholder: "relative",
          listItem: "listitem",
        }}
        tree={data[type].map((item) => ({
          id: item.id,
          parent: item.parent || "0",
          text: item.title,
          droppable: item.folder,
          data: item,
        }))}
        rootId={"0"}
        sort={false}
        insertDroppableFirst={false}
        initialOpen={
          data[type]?.filter((doc) => doc.expanded).map((doc) => doc.id) ||
          false
        }
        render={(
          node: NodeModel<TreeDataType>,
          { depth, isOpen, onToggle }
        ) => (
          <TreeItem
            // @ts-ignore
            node={node}
            depth={depth}
            isOpen={isOpen}
            onToggle={onToggle}
            // cm={cm}
          />
        )}
        dragPreviewRender={(monitorProps) => (
          <DragPreview
            text={monitorProps.item.text}
            droppable={monitorProps.item.droppable}
          />
        )}
        placeholderRender={(node, { depth }) => (
          <div
            style={{
              top: 0,
              right: 0,
              left: depth * 24,
              backgroundColor: "#1967d2",
              height: "2px",
              position: "absolute",
              transform: "translateY(-50%)",
            }}
          ></div>
        )}
        dropTargetOffset={10}
        canDrop={(tree, { dragSource, dropTargetId }) => {
          const depth = getDepth(data[type], dropTargetId);
          // Don't allow nesting documents beyond this depth
          if (depth > 3) return false;
          if (dragSource?.parent === dropTargetId) {
            return true;
          }
        }}
        // @ts-ignore
        onDrop={(tree, options) => handleDrop(tree, setTreeData)}
      />
    );

  return null;
}
