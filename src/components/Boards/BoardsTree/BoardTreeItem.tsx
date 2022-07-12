import { Icon } from "@iconify/react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { Link, useParams } from "react-router-dom";
import { BoardItemDisplayDialogProps, BoardProps } from "../../../custom-types";
import { useUpdateBoard } from "../../../utils/customHooks";
type Props = {
  boardId: string;
  setBoardId: (boardId: string) => void;
  node: NodeModel<BoardProps>;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  setDisplayDialog: (displayDialog: BoardItemDisplayDialogProps) => void;
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
    <Link
      to={node.id as string}
      style={{ marginInlineStart: depth * 10 }}
      className="text-md text-white no-underline hover:bg-blue-700 py-1 cursor-pointer pl-2 flex align-items-center"
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
          public: node.data?.public || false,
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
        className={`w-10 Lato ${boardId === node.id ? "text-primary" : ""}`}
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
    </Link>
  );
}
