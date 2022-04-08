import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { useEffect } from "react";
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

  // doc_id => param from URL
  // docId => state that's used for highlighting the current document in the tree
  const { doc_id } = useParams();

  useEffect(() => {
    if (doc_id) {
      setDocId(doc_id);
    }
  }, [doc_id]);

  return (
    <div className="text-white w-2 flex surface-50">
      <Tree
        classes={{ root: "list-none", container: "list-none" }}
        tree={treeData}
        rootId={"0"}
        render={(node, { depth, isOpen, onToggle }) => (
          <div
            style={{ marginInlineStart: depth * 10 }}
            className={`text-lg ${docId === node.id ? "bg-primary" : ""}`}
            onClick={() => {
              setDocId(node.id as string);
              navigate(doc_id === undefined ? `./${node.id}` : `./${doc_id}`);
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
