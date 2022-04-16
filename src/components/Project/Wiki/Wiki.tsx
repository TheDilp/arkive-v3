import { useState } from "react";
import { useQuery } from "react-query";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { auth, getCategories } from "../../../utils/supabaseUtils";
import { useGetDocuments } from "../../../utils/utils";
import RemirrorContext from "../../Editor/RemirrorContext";
import LoadingScreen from "../../Util/LoadingScreen";
import ProjectTree from "../ProjectTree";
import PropertiesPanel from "../PropertiesPanel";
export default function Wiki() {
  const [docId, setDocId] = useState("");
  const { project_id } = useParams();
  const documents = useGetDocuments(project_id as string);
  const categories = useQuery(
    "getCategories",
    async () => await getCategories(project_id as string),
    {
      staleTime: 5 * 60 * 1000, //5mins
    }
  );

  if (!documents) return <LoadingScreen />;
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
              <RemirrorContext setDocId={setDocId} documents={documents} />
              <PropertiesPanel />
            </>
          }
        />
      </Routes>
    </div>
  );
}
