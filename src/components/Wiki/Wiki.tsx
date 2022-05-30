import { lazy, Suspense, useContext, useEffect } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { useGetDocuments } from "../../utils/customHooks";
import { auth } from "../../utils/supabaseUtils";
import { MediaQueryContext } from "../Context/MediaQueryContext";
import LoadingScreen from "../Util/LoadingScreen";
import DocumentsTree from "./DocumentTree/DocumentTree";
import PropertiesPanel from "./PropertiesPanel/PropertiesPanel";
import FolderPage from "./FolderPage/FolderPage";
import { ProgressSpinner } from "primereact/progressspinner";
import { ProjectContext } from "../Context/ProjectContext";
const RemirrorContext = lazy(() => import("./Editor/RemirrorContext"));
export default function Wiki() {
  const { project_id } = useParams();
  const { isLoading } = useGetDocuments(project_id as string);
  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);
  const { setId: setDocId } = useContext(ProjectContext);

  useEffect(() => {
    return () => setDocId("");
  }, [setDocId]);

  if (isLoading) return <LoadingScreen />;
  return !auth.user() ? (
    <Navigate to="/login" />
  ) : (
    <div className="w-full flex flex-wrap justify-content-start mainScreen">
      <DocumentsTree />

      <Routes>
        <Route
          path="/doc/:doc_id"
          element={
            <div
              className={`flex flex-nowrap ${
                // Check if latop, then if mobile/tablet and set width
                isTabletOrMobile ? "w-full" : isLaptop ? "w-9" : "w-10"
              } h-full`}
            >
              <Suspense fallback={<ProgressSpinner />}>
                <RemirrorContext />
              </Suspense>

              <PropertiesPanel />
            </div>
          }
        />
        <Route path="/folder/:doc_id" element={<FolderPage />} />
      </Routes>
    </div>
  );
}
