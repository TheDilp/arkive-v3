import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import {
  BoardItemDisplayDialogType,
  BoardType,
  NodeUpdateDialogType,
} from "../../../types/BoardTypes";
import { useGetBoards, useSortChildren } from "../../../utils/customHooks";
import {
  BoardUpdateDialogDefault,
  NodeUpdateDialogDefault,
} from "../../../utils/defaultValues";
import { getDepth, handleDrop, TreeSortFunc } from "../../../utils/utils";
import { MediaQueryContext } from "../../Context/MediaQueryContext";
import TreeSidebar from "../../Util/TreeSidebar";
import DragPreview from "../../Wiki/DocumentTree/DragPreview";
import NodeUpdateDialog from "../NodeUpdateDialog";
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
  const [treeData, setTreeData] = useState<NodeModel<BoardType>[]>([]);
  const [templateNode, setTemplateNode] = useState<NodeUpdateDialogType>(
    NodeUpdateDialogDefault
  );
  const { data: boards } = useGetBoards(project_id as string);
  const sortChildrenMutation = useSortChildren();
  const [updateBoardDialog, setUpdateBoardDialog] =
    useState<BoardItemDisplayDialogType>(BoardUpdateDialogDefault);

  useEffect(() => {
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
          boards
            .sort((a, b) => TreeSortFunc(a.sort, b.sort))
            .map((board) => ({
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
      <BoardUpdateDialog
        boardData={updateBoardDialog}
        setBoardData={setUpdateBoardDialog}
        setTemplateNode={setTemplateNode}
      />
      <NodeUpdateDialog
        nodeUpdateDialog={templateNode}
        setNodeUpdateDialog={setTemplateNode}
      />

      <TreeSidebar>
        <BoardsFilter filter={filter} setFilter={setFilter} />
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
          render={(node: NodeModel<BoardType>, { depth, isOpen, onToggle }) => (
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
          onDrop={(tree, options) =>
            handleDrop(
              tree,
              // @ts-ignore
              options,
              setTreeData,
              sortChildrenMutation,
              project_id as string,
              "boards"
            )
          }
        />
      </TreeSidebar>
    </div>
  );
}
