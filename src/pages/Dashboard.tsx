import { Icon } from "@iconify/react";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Navigate } from "react-router-dom";

import ProjectCard from "../components/Card/ProjectCard";
import Navbar from "../components/Nav/Navbar";
import { useCreateProject, useGetAllProjects } from "../CRUD/ProjectCRUD";
import { ProjectType } from "../types/projectTypes";
import { getItem } from "../utils/storage";

export default function Dashboard() {
  const user = getItem("user");
  const { isLoading, error, data: projects } = useGetAllProjects(!!user);

  const createProjectMutation = useCreateProject();
  if (!user) return <Navigate to="auth/signin" />;
  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ProgressSpinner />
      </div>
    );

  if (error) return <span>An error has occurred</span>;
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className="align-start flex w-full flex-1">
        <div className="w-16 border-r  border-zinc-700">
          <div className="h-full w-full flex-wrap bg-zinc-800 py-5 text-white">
            <div className="my-auto flex w-full justify-center ">
              <Button
                className="p-button-outlined p-button-rounded p-button-plain"
                icon={<Icon fontSize={24} icon="mdi:plus" />}
                onClick={() => createProjectMutation.mutate()}
                tooltip="New Project"
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <Navbar />
          <div className="flex w-full flex-wrap items-start justify-start gap-x-6 px-6 py-4 pl-6">
            {projects?.length
              ? projects?.map((project: ProjectType) => <ProjectCard key={project.id} {...project} />)
              : "Click the button on the left to create a new project."}
          </div>
        </div>
      </div>
    </div>
  );
}
