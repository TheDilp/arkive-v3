import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Document } from "../../../custom-types";
import { auth, supabase } from "../../../utils/supabaseUtils";
import { useGetDocuments, useGetProjectData } from "../../../utils/utils";
import RemirrorContext from "../../Editor/RemirrorContext";
import LoadingScreen from "../../Util/LoadingScreen";
import ProjectTree from "../ProjectTree";
import PropertiesPanel from "../PropertiesPanel";
export default function Wiki() {
  const user = auth.user();
  const [docId, setDocId] = useState("");
  const { project_id } = useParams();
  const documents = useGetDocuments(project_id as string);
  const project = useGetProjectData(project_id as string);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // @ts-ignore
  useEffect(() => {
    if (project_id) {
      const documentsSub = supabase
        .from<Document>(`documents:project_id=eq.${project_id}`)
        .on("*", (payload) => {
          const { eventType } = payload;

          if (eventType === "INSERT") {
            queryClient.setQueryData(
              `${project_id}-documents`,
              (oldData: Document[] | undefined) => {
                if (oldData) {
                  if (
                    oldData.findIndex((doc) => doc.id === payload.new.id) === -1
                  ) {
                    return [...oldData, payload.new];
                  } else {
                    return oldData;
                  }
                }
                return [payload.new];
              }
            );
          } else if (eventType === "UPDATE") {
            queryClient.setQueryData(
              `${project_id}-documents`,
              (oldData: Document[] | undefined) => {
                if (oldData) {
                  let newData = [...oldData];
                  const index = newData.findIndex(
                    (doc) => doc.id === payload.new.id
                  );
                  if (index !== -1) {
                    newData[index] = payload.new;
                  }
                  return [...newData];
                }
                return [];
              }
            );
          } else if (eventType === "DELETE") {
            queryClient.setQueryData(
              `${project_id}-documents`,
              (oldData: Document[] | undefined) => {
                if (oldData) {
                  return oldData.filter((doc) => doc.id !== payload.old.id);
                }
                return [payload.new];
              }
            );
          }
        })
        .subscribe();
      return () => supabase.removeSubscription(documentsSub);
    }
  }, [project_id]);

  // @ts-ignore
  useEffect(() => {
    if (project_id) {
      const projectsUsersSub = supabase
        .from(`projects_users:project_id=eq.${project_id}`)
        .on("DELETE", (payload) => {
          if (payload.old.user_id === user?.id) {
            navigate("/");
          }
        })
        .subscribe();
      return () => supabase.removeSubscription(projectsUsersSub);
    }
  }, [project_id]);

  if (!documents || !project) return <LoadingScreen />;
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
