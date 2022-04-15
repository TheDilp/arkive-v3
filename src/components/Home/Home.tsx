import { useQuery } from "react-query";
import { auth, getProjects } from "../../utils/supabaseUtils";
import ProjectCard from "./ProjectCard";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../Util/LoadingScreen";
export default function Home() {
  const {
    data: projects,
    error,
    isLoading,
  } = useQuery("getAllProjects", async () => await getProjects());
  if (error || isLoading) return <LoadingScreen />;

  return auth.user() ? (
    <div className="Home w-8">
      <div className="w-full flex justify-content-center mt-5">
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
