import { Icon } from "@iconify/react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { useNavigate } from "react-router-dom";
import { iconSelect, Map, treeItemDisplayDialog } from "../../../custom-types";
type Props = {
  node: NodeModel<Map>;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  //   setDisplayDialog: (displayDialog: treeItemDisplayDialog) => void;
  //   setIconSelect: (iconSelect: iconSelect) => void;
  //   cm: any;
};

export default function MapTreeItem({
  node,
  //   docId,
  depth,
  isOpen,
  onToggle,
}: //   setDisplayDialog,
//   setIconSelect,
//   cm,
Props) {
  const navigate = useNavigate();
  return (
    <div
      style={{ marginInlineStart: depth * 10 }}
      className="text-lg hover:bg-blue-700 py-1 cursor-pointer"
      onClick={() => {
        if (!node.droppable) navigate(node.id as string);
      }}
      onContextMenu={(e) => {
        // cm.current.show(e);
        // setDisplayDialog({
        //   id: node.id as string,
        //   title: node.text,
        //   show: false,
        //   folder: node.data?.folder || false,
        //   depth,
        // });
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
        <Icon icon={"mdi:map"} inline={true} className="mr-1" />
      )}
      <span className={`text-lg Lato `}>{node.text}</span>
    </div>
  );
}
