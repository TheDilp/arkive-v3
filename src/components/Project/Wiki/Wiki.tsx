import { useContext, useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useGetDocuments } from "../../../utils/customHooks";
import { auth } from "../../../utils/supabaseUtils";
import { SidebarContext } from "../../Context/SidebarContext";
import RemirrorContext from "../../Editor/RemirrorContext";
import LoadingScreen from "../../Util/LoadingScreen";
import DocumentsTree from "../DocumentTree/DocumentTree";
import PropertiesPanel from "../PropertiesPanel/PropertiesPanel";
export default function Wiki() {
  const [docId, setDocId] = useState("");
  const { project_id } = useParams();
  const { isLoading } = useGetDocuments(project_id as string);

  const navigate = useNavigate();
  useEffect(() => {
    if (docId) {
      navigate(docId);
    }
  }, [docId]);
  if (isLoading) return <LoadingScreen />;
  return !auth.user() ? (
    <Navigate to="/login" />
  ) : (
    <div className="w-full flex flex-wrap justify-content-start mainScreen">
      <DocumentsTree docId={docId} setDocId={setDocId} />

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
