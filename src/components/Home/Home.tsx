import { Button } from "primereact/button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Navigate } from "react-router-dom";
import { Project } from "../../custom-types";
import { auth, createProject, getProjects } from "../../utils/supabaseUtils";
import LoadingScreen from "../Util/LoadingScreen";
import ProjectCard from "./ProjectCard";
export default function Home() {
  const queryClient = useQueryClient();
  const {
    data: projects,
    error,
    isLoading,
  } = useQuery("getAllProjects", async () => await getProjects());
  const createProjectMutation = useMutation(async () => await createProject(), {
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(
          "getAllProjects",
          (oldData: Project[] | undefined) => {
            if (oldData) {
              return [...oldData, data];
            } else {
              return [];
            }
          }
        );
      }
    },
  });
  if (error || isLoading) return <LoadingScreen />;

  return auth.user() ? (
    <div className="Home w-full flex h-screen">
      <div className="w-1 Lato">
        <div className="w-4 h-full surface-50 text-white flex-wrap py-5">
          <div className="w-full flex justify-content-center">
            <Button
              icon="pi pi-plus"
              className="p-button-rounded p-button-plain"
              tooltip="New Project"
              onClick={() => createProjectMutation.mutate()}
            />
          </div>
        </div>
      </div>
      <div className="w-11 flex justify-content-start mt-5">
        {projects &&
          projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}
