import { Icon } from "@iconify/react";
import {
  NodeModel,
  Tree,
  MultiBackend,
  getBackendOptions,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import { Button } from "primereact/button";
import { useLayoutEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { boardItemDisplayDialogProps, BoardProps } from "../../../custom-types";
import { useCreateBoard, useUpdateBoard } from "../../../utils/customHooks";
import { getDepth } from "../../../utils/utils";
import DragPreview from "../../Project/DocumentTree/DragPreview";
import BoardTreeItem from "./BoardTreeItem";
import BoardTreeItemContext from "./BoardTreeItemContext";
import BoardUpdateDialog from "./BoardUpdateDialog";
type Props = {
  boardId: string;
  cyRef: any;
};

export default function BoardsTree({ boardId, cyRef }: Props) {
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const cm = useRef() as any;
  const [treeData, setTreeData] = useState<NodeModel<BoardProps>[]>([]);
  const boards: BoardProps[] | undefined = queryClient.getQueryData<
    BoardProps[]
  >(`${project_id}-boards`);
  const createBoardMutation = useCreateBoard();
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
    updateBoardMutation.mutate({
      id: dragSourceId,
      parent: dropTargetId === "0" ? null : dropTargetId,
    });
  };
  useLayoutEffect(() => {
    if (boards && boards.length > 0) {
      let temp = boards.map((board) => ({
        id: board.id,
        parent: board.parent || "0",
        text: board.title,
        droppable: board.folder,
        data: board,
      }));
      setTreeData(temp);
    }
  }, [boards]);

  function createNewBoard(type: string) {
    let id = uuid();
    if (type === "folder") {
      createBoardMutation.mutate({
        id,
        project_id: project_id as string,
        title: "New Folder",
        folder: true,
        layout: "Preset",
      });
    } else {
      createBoardMutation.mutate({
        id,
        project_id: project_id as string,
        title: "New Board",
        folder: false,
        layout: "Preset",
      });
    }
  }

  return (
    <div
      className="w-2 bg-gray-800 text-white pt-2 px-2"
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
      <div className="w-full py-1 flex justify-content-between">
        <Button
          label="New Folder"
          icon="pi pi-fw pi-folder"
          iconPos="right"
          className="p-button-outlined"
          onClick={() => createNewBoard("folder")}
        />
        <Button
          label="New Board"
          icon={() => (
            <span className="p-button-icon p-c p-button-icon-right pi pi-fw">
              <Icon
                icon={"mdi:draw"}
                style={{ float: "right" }}
                fontSize={18}
              />
            </span>
          )}
          className="p-button-outlined"
          onClick={() => createNewBoard("board")}
        />
      </div>
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Tree
          tree={treeData}
          classes={{
            root: "w-full overflow-y-auto projectTreeRoot p-0",
            container: "list-none",
            placeholder: "relative",
          }}
          sort={false}
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
    </div>
  );
}
