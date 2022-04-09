import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { auth, getProjects } from "../../utils/supabaseUtils";
import ProjectCard from "./ProjectCard";
import "../../styles/Home.css";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../Util/LoadingScreen";
export default function Home() {
  const {
    data: projects,
    error,
    isLoading,
  } = useQuery("getAllProjects", async () => await getProjects());
  if (error || isLoading)
    return (
      <div className="text-white">
        <LoadingScreen />
      </div>
    );

  return auth.user() ? (
    <div className="Home w-8">
      <div className="w-full flex justify-content-center mt-5">
        {projects &&
          projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        {/* <div className="projectCardContainer">
          <div className="projectCard">
            <div className="projectCardTitleContainer">
              <h2>New Project</h2>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}
