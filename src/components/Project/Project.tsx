import { NodeModel } from "@minoru/react-dnd-treeview";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Route, Routes, useParams } from "react-router-dom";
import { Document } from "../../custom-types";
import { getCurrentProject, getDocuments } from "../../utils/supabaseUtils";
import RemirrorContext from "../Editor/RemirrorContext";
import ProjectTree from "./ProjectTree";
import PropertiesPanel from "./PropertiesPanel";
export default function Project() {
  const { project_id } = useParams();
  const [docId, setDocId] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [treeData, setTreeData] = useState<NodeModel[]>([]);

  const {
    data: documentsData,
    error: documentsError,
    isLoading,
  } = useQuery(
    `${project_id}-documents`,
    async () => await getDocuments(project_id as string)
  );
  const {
    data: currentProject,
    error: projectError,
    isLoading: projectLoading,
  } = useQuery(
    `${project_id}-project`,
    async () => await getCurrentProject(project_id as string)
  );
  useEffect(() => {
    if (documentsData && documentsData.length > 0) {
      const newTreeData = documentsData.map((document) => ({
        id: document.id,
        parent: document.parent,
        text: document.title,
        droppable: document.folder,
      }));
      setTreeData(newTreeData);
    }
  }, [documentsData]);

  if (isLoading || documentsError || projectError || projectLoading)
    return <div>TEST</div>;
  return (
    <div className="w-full flex flex-wrap justify-content-start">
      <ProjectTree
        treeData={treeData}
        setTreeData={setTreeData}
        docId={docId}
        setDocId={setDocId}
        setDocuments={setDocuments}
      />

      <Routes>
        <Route
          path="/:doc_id"
          element={
            <>
              <RemirrorContext
                setDocId={setDocId}
                documents={documents}
                setDocuments={setDocuments}
              />
              <PropertiesPanel />
            </>
          }
        />
      </Routes>
    </div>
  );
}
