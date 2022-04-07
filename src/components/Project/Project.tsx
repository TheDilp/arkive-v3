import { useMutation, useQuery } from "react-query";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { getDocuments, updateDocument } from "../../utils/supabaseUtils";
import { Tree, NodeModel } from "@minoru/react-dnd-treeview";
import { useEffect, useState } from "react";
import "../../styles/Project.css";
import RemirrorContext from "../Editor/RemirrorContext";
export default function Project() {
  const { project_id } = useParams();

  const [treeData, setTreeData] = useState<NodeModel[]>([]);
  const handleDrop = (newTree: NodeModel[]) => setTreeData(newTree);
  const {
    data: documents,
    error,
    isLoading,
  } = useQuery(
    `${project_id}-documents`,
    async () => await getDocuments(project_id as string)
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (documents && documents.length > 0) {
      const newTreeData = documents.map((document) => ({
        id: document.id,
        parent: document.parent,
        text: document.title,
        droppable: document.folder,
      }));
      setTreeData(newTreeData);
    }
  }, [documents]);
  const [docId, setDocId] = useState("");
  if (isLoading || error) return <div>TEST</div>;
  return (
    <div style={{ width: "100%" }} className="projectContainer">
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
      <Routes>
        <Route path="/:doc_id" element={<RemirrorContext />} />
      </Routes>
    </div>
  );
}
