import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BoardItemDisplayDialogProps,
  BoardProps,
} from "../../../types/BoardTypes";
import { useGetBoards, useUpdateBoard } from "../../../utils/customHooks";
import { BoardUpdateDialogDefault } from "../../../utils/defaultDisplayValues";
import { sortBoardsChildren } from "../../../utils/supabaseUtils";
import { getDepth } from "../../../utils/utils";
import { MediaQueryContext } from "../../Context/MediaQueryContext";
import TreeSidebar from "../../Util/TreeSidebar";
import DragPreview from "../../Wiki/DocumentTree/DragPreview";
import BoardsFilter from "./BoardsFilter";
import BoardTreeItem from "./BoardTreeItem";
import BoardTreeItemContext from "./BoardTreeItemContext";
import BoardUpdateDialog from "./BoardUpdateDialog";
type Props = {
  boardId: string;
  setBoardId: (boardId: string) => void;
};

export default function BoardsTree({ boardId, setBoardId }: Props) {
  const { project_id } = useParams();
  const cm = useRef() as any;
  const { isTabletOrMobile } = useContext(MediaQueryContext);
  const [filter, setFilter] = useState("");
  const [treeData, setTreeData] = useState<NodeModel<BoardProps>[]>([]);
  const { data: boards } = useGetBoards(project_id as string);
  const updateBoardMutation = useUpdateBoard(project_id as string);
  const [updateBoardDialog, setUpdateBoardDialog] =
    useState<BoardItemDisplayDialogProps>(BoardUpdateDialogDefault);
  const handleDrop = (
    newTree: NodeModel<BoardProps>[],
    {
      dragSourceId,
      dragSource,
      dropTargetId,
    }: {
      dragSourceId: string;
      dragSource: NodeModel<BoardProps>;
      dropTargetId: string;
    }
  ) => {
    // Set the user's current view to the new tree
    setTreeData(newTree);

    let indexes = newTree
      .filter(
        (board) =>
          board.data?.parent?.id === dropTargetId ||
          (board.data?.parent?.id === undefined && dropTargetId === "0")
      )
      .map((board, index) => {
        return { id: board.id as string, sort: index };
      });

    sortBoardsChildren(indexes);

    // SAFEGUARD: If parent is the same, avoid unneccesary update
    if (dragSource.data?.parent?.id === dropTargetId) return;

    updateBoardMutation.mutate({
      id: dragSourceId,
      parent: dropTargetId === "0" ? null : dropTargetId,
    });
  };
  useLayoutEffect(() => {
    if (boards) {
      if (filter) {
        const timeout = setTimeout(() => {
          setTreeData(
            boards
              .filter(
                (board) =>
                  !board.folder &&
                  board.title.toLowerCase().includes(filter.toLowerCase())
              )
              .map((board) => ({
                id: board.id,
                parent: "0",
                text: board.title,
                droppable: board.folder,
                data: board,
              }))
          );
        }, 300);
        return () => clearTimeout(timeout);
      } else {
        setTreeData(
          boards.map((board) => ({
            id: board.id,
            parent: board.parent?.id || "0",
            text: board.title,
            droppable: board.folder,
            data: board,
          }))
        );
      }
    } else {
      setTreeData([]);
    }
  }, [boards, filter]);

  return (
    <div
      className={` text-white pt-2 px-2 ${
        isTabletOrMobile ? "surface-0 hidden" : "surface-50 w-2"
      }`}
      style={{
        height: "96vh",
      }}
    >
      <BoardTreeItemContext
        cm={cm}
        boardId={boardId}
        displayDialog={updateBoardDialog}
        setDisplayDialog={setUpdateBoardDialog}
      />
      {updateBoardDialog.show && (
        <BoardUpdateDialog
          visible={updateBoardDialog}
          setVisible={setUpdateBoardDialog}
        />
      )}
      <TreeSidebar>
        <BoardsFilter filter={filter} setFilter={setFilter} />
        <Tree
          tree={treeData}
          classes={{
            root: "w-full overflow-y-auto projectTreeRoot p-0",
            container: "list-none",
            placeholder: "relative",
          }}
          sort={true}
          insertDroppableFirst={true}
          initialOpen={
            boards
              ?.filter((board) => board.expanded)
              .map((board) => board.id) || false
          }
          rootId="0"
          render={(
            node: NodeModel<BoardProps>,
            { depth, isOpen, onToggle }
          ) => (
            <BoardTreeItem
              node={node}
              boardId={boardId}
              setBoardId={setBoardId}
              depth={depth}
              isOpen={isOpen}
              onToggle={onToggle}
              setDisplayDialog={setUpdateBoardDialog}
              cm={cm}
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
      </TreeSidebar>
    </div>
  );
}
