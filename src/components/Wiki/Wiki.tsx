import { ProgressSpinner } from "primereact/progressspinner";
import { lazy, Suspense, useContext, useEffect } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { DocumentProps } from "../../custom-types";
import {
  useDeleteDocument,
  useGetDocuments,
  useUpdateDocument,
} from "../../utils/customHooks";
import { docItemDisplayDialogDefault } from "../../utils/defaultDisplayValues";
import { auth } from "../../utils/supabaseUtils";
import { MediaQueryContext } from "../Context/MediaQueryContext";
import { ProjectContext } from "../Context/ProjectContext";
import ItemTree from "../ItemTree";
import LoadingScreen from "../Util/LoadingScreen";
import FolderPage from "./FolderPage/FolderPage";
import PropertiesPanel from "./PropertiesPanel/PropertiesPanel";
const RemirrorContext = lazy(() => import("./Editor/RemirrorContainer"));
export default function Wiki() {
  const { project_id } = useParams();
  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);
  const { id: docId, setId: setDocId } = useContext(ProjectContext);
  const updateDocumentMutation = useUpdateDocument(project_id as string);
  const deleteDocumentMutation = useDeleteDocument(project_id as string);
  const { data: documents, isLoading } = useGetDocuments(project_id as string);
  useEffect(() => {
    return () => setDocId("");
  }, [setDocId]);

  if (isLoading) return <LoadingScreen />;

  return !auth.user() ? (
    <Navigate to="/login" />
  ) : (
    <div className="w-full flex flex-wrap justify-content-start mainScreen">
      <ItemTree
        id={docId}
        setId={setDocId}
        data={documents as DocumentProps[]}
        updateMutation={updateDocumentMutation}
        deleteMutation={deleteDocumentMutation}
        dialogDefault={docItemDisplayDialogDefault}
      />
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
