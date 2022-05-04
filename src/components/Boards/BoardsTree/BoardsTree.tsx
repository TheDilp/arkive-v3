import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import React, { useLayoutEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Board } from "../../../custom-types";
import { getDepth } from "../../../utils/utils";
import DragPreview from "../../Project/DocumentTree/DragPreview";
import BoardTreeItem from "./BoardTreeItem";

type Props = {
  boardId: string;
  setBoardId: (boardId: string) => void;
};

export default function BoardsTree({ boardId, setBoardId }: Props) {
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const [treeData, setTreeData] = useState<NodeModel<Board>[]>([]);
  const boards: Board[] | undefined = queryClient.getQueryData<Board[]>(
    `${project_id}-boards`
  );
  const handleDrop = (
    newTree: NodeModel<Board>[],
    {
      dragSourceId,
      dropTargetId,
    }: { dragSourceId: string; dropTargetId: string }
  ) => {
    // Set the user's current view to the new tree
    setTreeData(newTree);
    // updateMapMutation.mutate({
    //   id: dragSourceId,
    //   parent: dropTargetId === "0" ? null : dropTargetId,
    // });
  };
  useLayoutEffect(() => {
    if (boards && boards.length > 0) {
      let temp = boards.map((m) => ({
        id: m.id,
        parent: m.parent || "0",
        text: m.title,
        droppable: m.folder,
        data: {
          ...m,
        },
      }));
      setTreeData(temp);
    }
  }, [boards]);
  return (
    <div>
      <Tree
        tree={treeData}
        classes={{
          root: "w-full overflow-y-auto",
          container: "list-none",
          placeholder: "relative",
        }}
        sort={false}
        initialOpen={false}
        rootId="0"
        render={(node: NodeModel<Board>, { depth, isOpen, onToggle }) => (
          <BoardTreeItem
            node={node}
            boardId={boardId}
            depth={depth}
            isOpen={isOpen}
            onToggle={onToggle}
            // setDisplayDialog={setUpdateMapDialog}
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
          const depth = getDepth(treeData, dropTargetId);
          // Don't allow nesting documents beyond this depth
          if (depth > 3) return false;
          if (dragSource?.parent === dropTargetId) {
            return true;
          }
        }}
        //@ts-ignore
        onDrop={handleDrop}
      />
    </div>
  );
}
