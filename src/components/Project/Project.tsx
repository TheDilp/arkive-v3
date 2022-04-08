import { NodeModel } from "@minoru/react-dnd-treeview";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Route, Routes, useParams } from "react-router-dom";
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
    <div className="w-full flex flex-wrap justify-content-start">
      <ProjectTree
        treeData={treeData}
        setTreeData={setTreeData}
        docId={docId}
        setDocId={setDocId}
      />

      <Routes>
        <Route
          path="/:doc_id"
          element={<RemirrorContext setDocId={setDocId} />}
        />
      </Routes>
    </div>
  );
}
