import { NodeModel } from "@minoru/react-dnd-treeview";
import { useNavigate, useParams } from "react-router-dom";
import { Document, treeItemDisplayDialog } from "../../../custom-types";
type Props = {
  docId: string;
  node: NodeModel;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  setDocId: (docId: string) => void;
  setDisplayDialog: (displayDialog: treeItemDisplayDialog) => void;
  cm: any;
};

export default function ProjectTreeItem({
  node,
  docId,
  depth,
  isOpen,
  onToggle,
  setDocId,
  setDisplayDialog,
  cm,
}: Props) {
  const { doc_id } = useParams();
  const navigate = useNavigate();

  return (
    <div
      style={{ marginInlineStart: depth * 10 }}
      className="text-lg hover:bg-blue-300 py-1 pl-2"
      onClick={() => {
        setDocId(node.id as string);
        navigate(doc_id === undefined ? `./${node.id}` : `./${doc_id}`);
      }}
      onContextMenu={(e) => {
        cm.current.show(e);
        setDisplayDialog({
          id: node.id as string,
          title: node.text,
          show: false,
        });
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
            <i className="pi pi-fw pi-chevron-down"></i>
          ) : (
            <i className="pi pi-fw pi-chevron-right"></i>
          )}
        </span>
      )}
      <i className={`pi pi-fw ${node.droppable ? "pi-folder" : "pi-file"}`}></i>
      <span
        className={`text-lg hover:bg-blue-300 Lato ${
          docId === node.id ? "text-primary" : ""
        }`}
      >
        {node.text}
      </span>
    </div>
  );
}
