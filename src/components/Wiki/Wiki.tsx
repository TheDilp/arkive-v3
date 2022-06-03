import { ProgressSpinner } from "primereact/progressspinner";
import { lazy, Suspense, useContext, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { auth } from "../../utils/supabaseUtils";
import { MediaQueryContext } from "../Context/MediaQueryContext";
import { ProjectContext } from "../Context/ProjectContext";
import DocumentsTree from "./DocumentTree/DocumentTree";
import FolderPage from "./FolderPage/FolderPage";
import PropertiesPanel from "./PropertiesPanel/PropertiesPanel";
const RemirrorContext = lazy(() => import("./Editor/RemirrorContainer"));
export default function Wiki() {
  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);
  const { setId: setDocId } = useContext(ProjectContext);

  useEffect(() => {
    return () => setDocId("");
  }, [setDocId]);

  return !auth.user() ? (
    <Navigate to="/login" />
  ) : (
    <div className="w-full flex flex-wrap justify-content-start mainScreen">
      <DocumentsTree />

      <Routes>
        <Route path="/" element={<FolderPage />} />
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
