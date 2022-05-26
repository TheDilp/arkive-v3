import { Icon } from "@iconify/react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { useParams } from "react-router-dom";
import { boardItemDisplayDialogProps, BoardProps } from "../../../custom-types";
import { useUpdateBoard } from "../../../utils/customHooks";
type Props = {
  boardId: string;
  setBoardId: (boardId: string) => void;
  node: NodeModel<BoardProps>;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  setDisplayDialog: (displayDialog: boardItemDisplayDialogProps) => void;
  cm: any;
};

export default function BoardTreeItem({
  node,
  boardId,
  setBoardId,
  depth,
  isOpen,
  setDisplayDialog,
  onToggle,
  cm,
}: Props) {
  const { project_id } = useParams();
  const updateBoardMutation = useUpdateBoard(project_id as string);
  return (
    <div
      style={{ marginInlineStart: depth * 10 }}
      className="text-sm hover:bg-blue-700 py-1 cursor-pointer pl-2 flex align-items-center"
      onClick={() => {
        if (!node.droppable) setBoardId(node.id as string);
      }}
      onContextMenu={(e) => {
        setDisplayDialog({
          id: node.id as string,
          title: node.text,
          parent: node.data?.parent?.id || "0",
          folder: node.droppable || false,
          depth,
          expanded: false,
          layout: node.data?.layout || "Preset",
          show: false,
        });
        cm.current.show(e);
      }}
    >
      {node.droppable && (
        <span
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            updateBoardMutation.mutate({
              id: node.id as string,
              expanded: !isOpen,
            });
            onToggle();
            onToggle();
          }}
        >
          {isOpen ? (
            <Icon icon="akar-icons:chevron-down" />
          ) : (
            <Icon icon="akar-icons:chevron-right" />
          )}
        </span>
      )}
      {node.droppable ? (
        <Icon icon="bxs:folder" inline={true} className="mr-1" />
      ) : (
        <Icon icon={"mdi:draw"} inline={true} className="mr-1" />
      )}
      <div
        className={`text-lg w-10 Lato ${
          boardId === node.id ? "text-primary" : ""
        }`}
        onClick={(e) => {
          if (node.droppable) {
            e.preventDefault();
            e.stopPropagation();
            updateBoardMutation.mutate({
              id: node.id as string,
              expanded: !isOpen,
            });
            onToggle();
          }
        }}
      >
        {node.text}
      </div>
    </div>
  );
}
