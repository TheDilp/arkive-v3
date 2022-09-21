import { ProgressSpinner } from "primereact/progressspinner";
import { lazy, Suspense, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { auth } from "../../utils/supabaseUtils";
import { MediaQueryContext } from "../Context/MediaQueryContext";
import DocumentsTree from "./DocumentTree/DocumentTree";
import FolderPage from "./FolderPage/FolderPage";
import PropertiesPanel from "./PropertiesPanel/PropertiesPanel";
const RemirrorContainer = lazy(() => import("./Editor/RemirrorContainer"));
export default function Wiki() {
  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);

  return !auth.user() ? (
    <Navigate to="/auth" />
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
                <RemirrorContainer />
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
