import React from "react";
import { useQuery } from "react-query";
import { getProjects } from "../../utils/supabaseUtils";
import ProjectCard from "./ProjectCard";
import "../../styles/Home.css";
export default function Home() {
  const {
    data: projects,
    error,
    isLoading,
  } = useQuery("getAllProjects", async () => await getProjects());
  if (error || isLoading) return <div>"TEST"</div>;
  return (
    <div className="Home w-8">
      <div className="w-full flex justify-content-center mt-5">
        {projects?.map((project) => (
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
  );
}
