import { Button } from "primereact/button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useMediaQuery } from "react-responsive";
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
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

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
    <div className="Home w-full flex flex-wrap align-content-start h-screen overflow-y-auto">
      <div
        className="w-full"
        style={{
          height: "3.5vh",
        }}
      >
        <Navbar />
      </div>
      <div
        className={`flex w-full ${isTabletOrMobile ? "flex-wrap" : ""}`}
        style={{
          height: "96.5vh",
        }}
      >
        <div className={`Lato ${isTabletOrMobile ? "w-2" : "w-1"}`}>
          <div
            className={`${
              isTabletOrMobile ? "w-8" : "w-3"
            } h-full bg-gray-800 text-white flex-wrap py-5`}
          >
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
        <div
          className={`${
            isTabletOrMobile ? "w-10 flex-wrap" : "w-8"
          } flex justify-content-start mt-5`}
        >
          {projects &&
            projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}
