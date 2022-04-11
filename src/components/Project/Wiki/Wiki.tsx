import { NodeModel } from "@minoru/react-dnd-treeview";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { Document } from "../../../custom-types";
import { auth } from "../../../utils/supabaseUtils";
import RemirrorContext from "../../Editor/RemirrorContext";
import ProjectTree from "../ProjectTree";
import PropertiesPanel from "../PropertiesPanel";
export default function Wiki() {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const [docId, setDocId] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [treeData, setTreeData] = useState<NodeModel[]>([]);

  const documentsData: Document[] | undefined = queryClient.getQueryData(
    `${project_id}-documents`
  );

  useEffect(() => {
    if (documentsData && documentsData.length > 0) {
      const newTreeData = documentsData.map((document) => ({
        id: document.id,
        parent: document.parent ?? "0",
        text: document.title,
        droppable: document.folder,
      }));
      setTreeData(newTreeData);
    }
  }, [documentsData]);

  return !auth.user() ? (
    <Navigate to="/login" />
  ) : (
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
