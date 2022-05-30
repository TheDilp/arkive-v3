import { lazy, useContext } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { useGetDocuments } from "../../utils/customHooks";
import { auth } from "../../utils/supabaseUtils";
import { MediaQueryContext } from "../Context/MediaQueryContext";
import LoadingScreen from "../Util/LoadingScreen";
const RemirrorContext = lazy(() => import("./Editor/RemirrorContext"));
const DocumentsTree = lazy(() => import("./DocumentTree/DocumentTree"));
const PropertiesPanel = lazy(() => import("./PropertiesPanel/PropertiesPanel"));
const FolderPage = lazy(() => import("./FolderPage/FolderPage"));
export default function Wiki() {
  const { project_id } = useParams();
  const { isLoading } = useGetDocuments(project_id as string);
  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);
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
              <RemirrorContext />
              <PropertiesPanel />
            </div>
          }
        />
        <Route path="/folder/:doc_id" element={<FolderPage />} />
      </Routes>
    </div>
  );
}
