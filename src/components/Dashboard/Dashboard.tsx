import { Button } from "primereact/button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useMediaQuery } from "react-responsive";
import { Navigate } from "react-router-dom";
import { ProjectProps } from "../../custom-types";
import { auth, createProject, getProjects } from "../../utils/supabaseUtils";
import Navbar from "../Nav/Navbar";
import LoadingScreen from "../Util/LoadingScreen";
import ProjectCard from "./ProjectCard";
export default function Dashboard() {
  const queryClient = useQueryClient();
  const {
    data: projects,
    error,
    isLoading,
  } = useQuery("getAllProjects", async () => await getProjects());
  const isPhone = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1224px)" });
  const isLaptop = useMediaQuery({ query: "(max-width: 1440px)" });
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
  if (!auth.user()) return <Navigate to="/auth" />;
  return (
    <div className="Home w-full flex flex-wrap align-content-start h-screen overflow-y-auto">
      <div className="w-full">
        <Navbar />
      </div>
      <div
        className={`flex w-full ${
          isTablet ? "flex-wrap" : ""
        } align-content-start`}
        style={{
          minHeight: "96.5vh",
        }}
      >
        <div className={`Lato ${isTablet ? "w-full" : "w-4rem"} `}>
          <div
            className={`${
              isTablet ? "w-full py-2" : "w-full py-5"
            } h-full bg-gray-800 text-white flex-wrap `}
          >
            <div className="w-full flex justify-content-center my-auto ">
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
            isPhone
              ? "flex-column align-items-center px-6 "
              : "flex-row flex-wrap pl-6"
          } flex w-full py-4 gap-3 justify-content-start `}
        >
          {projects &&
            projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
        </div>
      </div>
    </div>
  );
}
