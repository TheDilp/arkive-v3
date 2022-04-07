import React, { useEffect, useState } from "react";
import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { useNavigate, useParams } from "react-router-dom";

type Props = {
  treeData: NodeModel[];
  setTreeData: (treeData: NodeModel[]) => void;
  docId: string;
  setDocId: (docId: string) => void;
};

export default function ProjectTree({
  treeData,
  setTreeData,
  docId,
  setDocId,
}: Props) {
  const handleDrop = (newTree: NodeModel[]) => setTreeData(newTree);
  const navigate = useNavigate();
  const { doc_id } = useParams();

  useEffect(() => {
    if (doc_id) {
      setDocId(doc_id);
    }
  }, [doc_id]);

  return (
    <div className="projectTreeContainer">
      <Tree
        tree={treeData}
        rootId={"0"}
        render={(node, { depth, isOpen, onToggle }) => (
          <div
            style={{ marginInlineStart: depth * 10 }}
            className={`projectTreeNode ${
              docId === node.id ? "projectTreeNodeActive" : ""
            }`}
            onClick={() => {
              setDocId(node.id as string);
              navigate(`./${node.id}`);
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
                {isOpen ? "[-]" : "[+]"}
              </span>
            )}
            {node.text}
          </div>
        )}
        dragPreviewRender={(monitorProps) => (
          <div
            style={{
              backgroundColor: "blue",
              width: "10%",
              position: "absolute",
            }}
          >
            {monitorProps.item.text}
          </div>
        )}
        onDrop={handleDrop}
      />
    </div>
  );
}
