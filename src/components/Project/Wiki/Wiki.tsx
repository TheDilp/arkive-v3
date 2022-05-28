import { useContext, useEffect } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { useGetDocuments } from "../../../utils/customHooks";
import { auth } from "../../../utils/supabaseUtils";
import { MediaQueryContext } from "../../Context/MediaQueryContext";
import { ProjectContext } from "../../Context/ProjectContext";
import RemirrorContext from "../../Editor/RemirrorContext";
import LoadingScreen from "../../Util/LoadingScreen";
import DocumentsTree from "../DocumentTree/DocumentTree";
import PropertiesPanel from "../PropertiesPanel/PropertiesPanel";
export default function Wiki() {
  const { project_id } = useParams();
  const { data: documents, isLoading } = useGetDocuments(project_id as string);
  const { id: docId, setId: setDocId } = useContext(ProjectContext);
  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);
  if (isLoading) return <LoadingScreen />;
  return !auth.user() ? (
    <Navigate to="/login" />
  ) : (
    <div className="w-full flex flex-wrap justify-content-start mainScreen">
      <DocumentsTree />

      <Routes>
        <Route
          path="/:doc_id"
          element={
            <div
              className={`flex flex-nowrap ${
                // Check if latop, then if mobile/tablet and set width
                isTabletOrMobile ? "w-full" : isLaptop ? "w-9" : "w-10"
              } h-full`}
            >
              <RemirrorContext />
              <PropertiesPanel />
            </div>
          }
        />
      </Routes>
    </div>
  );
}
