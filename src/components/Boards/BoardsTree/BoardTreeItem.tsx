import { Icon } from "@iconify/react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { useNavigate } from "react-router-dom";
import { BoardProps, boardItemDisplayDialogProps } from "../../../custom-types";
type Props = {
  boardId: string;
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
  depth,
  isOpen,
  setDisplayDialog,
  onToggle,
  cm,
}: Props) {
  const navigate = useNavigate();
  return (
    <div
      style={{ marginInlineStart: depth * 10 }}
      className="text-lg hover:bg-blue-700 py-1 cursor-pointer"
      onClick={() => {
        if (!node.droppable) navigate(node.id as string);
      }}
      onContextMenu={(e) => {
        setDisplayDialog({
          id: node.id as string,
          title: node.text,
          parent: node.data?.parent || "0",
          folder: node.droppable || false,
          depth,
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
      <span
        className={`text-lg Lato ${boardId === node.id ? "text-primary" : ""}`}
      >
        {node.text}
      </span>
    </div>
  );
}
