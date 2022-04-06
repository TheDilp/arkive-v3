import React from "react";
import { useQuery } from "react-query";
import { getProjects, user } from "../../utils/supabaseUtils";

export default function Home() {
  const {
    data: projects,
    error,
    isLoading,
  } = useQuery("getAllProjects", async () => await getProjects());
  if (error || isLoading) return <div>"TEST"</div>;
  return <div className="Home">{projects?.map((project) => project.title)}</div>;
}
