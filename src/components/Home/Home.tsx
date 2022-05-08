import { Icon } from "@iconify/react";
import { Button } from "primereact/button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Navigate } from "react-router-dom";
import { ProjectProps } from "../../custom-types";
import { auth, createProject, getProjects } from "../../utils/supabaseUtils";
import Navbar from "../Nav/Navbar";
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
          (oldData: ProjectProps[] | undefined) => {
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
    <div className="Home w-full flex flex-wrap align-content-start h-screen">
      <div className="w-full">
        <Navbar />
      </div>
      <div className="w-1 Lato h-full">
        <div className="w-4 h-full bg-gray-800 text-white flex-wrap py-5">
          <div className="w-full flex justify-content-center mb-2">
            <Button
              icon="pi pi-plus"
              className="p-button-outlined p-button-rounded p-button-plain"
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
