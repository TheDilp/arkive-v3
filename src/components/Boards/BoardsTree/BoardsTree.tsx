import {
  getBackendOptions,
  MultiBackend,
  NodeModel,
  Tree,
} from "@minoru/react-dnd-treeview";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { boardItemDisplayDialogProps, BoardProps } from "../../../custom-types";
import { useUpdateBoard } from "../../../utils/customHooks";
import { getDepth } from "../../../utils/utils";
import { MediaQueryContext } from "../../Context/MediaQueryContext";
import DragPreview from "../../Wiki/DocumentTree/DragPreview";
import TreeSidebar from "../../Util/TreeSidebar";
import BoardsFilter from "./BoardsFilter";
import BoardsFilterList from "./BoardsFilterList";
import BoardTreeItem from "./BoardTreeItem";
import BoardTreeItemContext from "./BoardTreeItemContext";
import BoardUpdateDialog from "./BoardUpdateDialog";
import { sortBoardsChildren } from "../../../utils/supabaseUtils";
type Props = {
  boardId: string;
  setBoardId: (boardId: string) => void;
  cyRef: any;
};

export default function BoardsTree({ boardId, setBoardId, cyRef }: Props) {
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const cm = useRef() as any;
  const { isLaptop, isTabletOrMobile } = useContext(MediaQueryContext);
  const [filter, setFilter] = useState("");
  const [treeData, setTreeData] = useState<NodeModel<BoardProps>[]>([]);
  const boards: BoardProps[] | undefined = queryClient.getQueryData<
    BoardProps[]
  >(`${project_id}-boards`);
  const updateBoardMutation = useUpdateBoard(project_id as string);
  const [updateBoardDialog, setUpdateBoardDialog] =
    useState<boardItemDisplayDialogProps>({
      id: "",
      title: "",
      parent: "",
      show: false,
      folder: false,
      expanded: false,
      layout: "",
      depth: 0,
      public: false,
    });
  const handleDrop = (
    newTree: NodeModel<BoardProps>[],
    {
      dragSourceId,
      dropTargetId,
    }: { dragSourceId: string; dropTargetId: string }
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

    updateBoardMutation.mutate({
      id: dragSourceId,
      parent: dropTargetId === "0" ? null : dropTargetId,
    });
  };
  useLayoutEffect(() => {
    if (boards && boards.length > 0) {
      let temp = boards.map((board) => ({
        id: board.id,
        parent: board.parent?.id || "0",
        text: board.title,
        droppable: board.folder,
        data: board,
      }));
      setTreeData(temp);
    }
  }, [boards]);

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
        cyRef={cyRef}
      />
      {updateBoardDialog.show && (
        <BoardUpdateDialog
          visible={updateBoardDialog}
          setVisible={setUpdateBoardDialog}
        />
      )}
      <TreeSidebar>
        <BoardsFilter filter={filter} setFilter={setFilter} />
        {!filter && (
          <DndProvider backend={MultiBackend} options={getBackendOptions()}>
            <Tree
              tree={treeData}
              classes={{
                root: "w-full overflow-y-auto projectTreeRoot p-0",
                container: "list-none",
                placeholder: "relative",
              }}
              sort={false}
              insertDroppableFirst={false}
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
          </DndProvider>
        )}
        {filter && (
          <BoardsFilterList
            filteredTree={treeData.filter(
              (node) =>
                node.text.toLowerCase().includes(filter.toLowerCase()) &&
                !node.droppable
            )}
            setBoardId={setBoardId}
          />
        )}
      </TreeSidebar>
    </div>
  );
}
