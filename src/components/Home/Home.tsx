import { useQuery } from "react-query";
import { auth, getProjects } from "../../utils/supabaseUtils";
import ProjectCard from "./ProjectCard";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../Util/LoadingScreen";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
export default function Home() {
  const {
    data: projects,
    error,
    isLoading,
  } = useQuery("getAllProjects", async () => await getProjects());
  if (error || isLoading) return <LoadingScreen />;

  return auth.user() ? (
    <div className="Home w-full flex h-screen">
      <div className="w-1 Lato">
        <div className="w-6 h-full surface-50 text-white flex-wrap py-5">
          <div className="w-full flex justify-content-center">
            <Button
              icon="pi pi-plus"
              className="p-button-rounded p-button-plain"
              tooltip="New Project"
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
