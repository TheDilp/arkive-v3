import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import "../../styles/Project.css";
import { getDocuments } from "../../utils/supabaseUtils";
import RemirrorContext from "../Editor/RemirrorContext";
import ProjectTree from "./ProjectTree";
export default function Project() {
  const { project_id } = useParams();
  const [docId, setDocId] = useState("");

  const [treeData, setTreeData] = useState<NodeModel[]>([]);
  const {
    data: documents,
    error,
    isLoading,
  } = useQuery(
    `${project_id}-documents`,
    async () => await getDocuments(project_id as string)
  );
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
      {!docId && (
        <ProjectTree
          treeData={treeData}
          setTreeData={setTreeData}
          docId={docId}
          setDocId={setDocId}
        />
      )}

      <Routes>
        <Route
          path="/:doc_id"
          element={
            <>
              {docId && (
                <ProjectTree
                  treeData={treeData}
                  setTreeData={setTreeData}
                  docId={docId}
                  setDocId={setDocId}
                />
              )}
              <RemirrorContext />
            </>
          }
        />
      </Routes>
    </div>
  );
}
