import { useQuery } from "react-query";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { getDocuments } from "../../utils/supabaseUtils";
import { Tree, NodeModel } from "@minoru/react-dnd-treeview";
import { useEffect, useState } from "react";
import "../../styles/Project.css";
import RemirrorContext from "../Editor/RemirrorContext";
export default function Project() {
  const { project_id } = useParams();
  const SampleData = [
    {
      id: 1,
      parent: 0,
      text: "Folder",
      droppable: true,
    },
    { id: 2, parent: 1, text: "File" },
    { id: 3, parent: 1, text: "File" },
    {
      id: 4,
      parent: 0,
      text: "Folder 2",
      droppable: true,
    },
  ];
  const [treeData, setTreeData] = useState<NodeModel[]>(SampleData);
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
              className="treeNode"
              onClick={() => navigate(`./${node.id}`)}
            >
              {node.droppable && (
                <span onClick={onToggle}>{isOpen ? "[-]" : "[+]"}</span>
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
