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
    <div className="Home">
      {projects?.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}
