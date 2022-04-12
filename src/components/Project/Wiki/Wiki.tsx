import { useState } from "react";
import { useQuery } from "react-query";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { auth, getDocuments } from "../../../utils/supabaseUtils";
import RemirrorContext from "../../Editor/RemirrorContext";
import LoadingScreen from "../../Util/LoadingScreen";
import ProjectTree from "../ProjectTree";
import PropertiesPanel from "../PropertiesPanel";
export default function Wiki() {
  const { project_id } = useParams();
  const [docId, setDocId] = useState("");
  const {
    data: docs,
    error: documentsError,
    isLoading,
  } = useQuery(
    `${project_id}-documents`,
    async () => await getDocuments(project_id as string),
    { staleTime: 5 * 60 * 1000 }
  );
  if (documentsError || isLoading) return <LoadingScreen />;
  console.log(docs);

  return !auth.user() ? (
    <Navigate to="/login" />
  ) : (
    <div className="w-full flex flex-wrap justify-content-start">
      <ProjectTree docId={docId} setDocId={setDocId} />

      <Routes>
        <Route
          path="/:doc_id"
          element={
            <>
              <RemirrorContext setDocId={setDocId} />
              <PropertiesPanel />
            </>
          }
        />
      </Routes>
    </div>
  );
}
