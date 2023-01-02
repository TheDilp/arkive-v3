import { Icon } from "@iconify/react";
import { Button } from "primereact/button";

import ProjectCard from "../components/Card/ProjectCard";
import { useCreateProject, useGetAllProjects } from "../CRUD/ProjectCRUD";
import { ProjectType } from "../types/projectTypes";

export default function Dashboard() {
  const { isLoading, error, data: projects } = useGetAllProjects();

  const createProjectMutation = useCreateProject();
  if (isLoading) return <span>Loading...</span>;

  if (error) return <span>An error has occurred</span>;
  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      <div className="flex flex-1 w-full align-start">
        <div className="w-16">
          <div className="flex-wrap w-full h-full py-5 text-white bg-zinc-800">
            <div className="flex justify-center w-full my-auto ">
              <Button
                className="p-button-outlined p-button-rounded p-button-plain"
                icon={<Icon fontSize={24} icon="mdi:plus" />}
                onClick={() => createProjectMutation.mutate()}
                tooltip="New Project"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-start justify-start w-full px-6 py-4 pl-6 gap-x-6">
          {projects?.length
            ? projects?.map((project: ProjectType) => <ProjectCard key={project.id} {...project} />)
            : "Click the button on the left to create a new project."}
        </div>
      </div>
    </div>
  );
}
