import { NodeModel } from "@minoru/react-dnd-treeview";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

type Props = {
  docId: string;
  node: NodeModel;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  setDocId: (docId: string) => void;
};

export default function ProjectTreeItem({
  node,
  docId,
  depth,
  isOpen,
  onToggle,
  setDocId,
}: Props) {
  const { doc_id } = useParams();
  const navigate = useNavigate();

  return (
    <div
      style={{ marginInlineStart: depth * 10 }}
      className={`text-lg hover:bg-blue-300 py-1 pl-2 Lato ${
        docId === node.id ? "bg-primary" : ""
      }`}
      onClick={() => {
        setDocId(node.id as string);
        navigate(doc_id === undefined ? `./${node.id}` : `./${doc_id}`);
      }}
    >
      <i className="pi pi-fw pi-bars"></i>
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
      {node.text}
    </div>
  );
}
