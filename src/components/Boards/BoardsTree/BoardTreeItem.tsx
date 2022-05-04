import { Icon } from "@iconify/react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { useNavigate } from "react-router-dom";
import { Board, Map, mapItemDisplayDialog } from "../../../custom-types";
type Props = {
  boardId: string;
  node: NodeModel<Board>;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  setDisplayDialog: (displayDialog: mapItemDisplayDialog) => void;
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
      className="text-lg hover:bg-blue-700 py-1 cursor-pointer text-white"
      onClick={() => {
        if (!node.droppable) navigate(node.id as string);
      }}
      onContextMenu={(e) => {
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
