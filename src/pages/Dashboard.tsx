import { useCreateProject, useGetAllProjects } from "../CRUD/ProjectCRUD";
import { Button } from "primereact/button";
import ProjectCard from "../components/Card/ProjectCard";
import { ProjectType } from "../types/projectTypes";
import { v4 as uuid } from "uuid";

export default function Dashboard() {
  const { isLoading, error, data: projects } = useGetAllProjects();

  const createProjectMutation = useCreateProject();
  if (isLoading) return <span>Loading...</span>;

  if (error) return <span>An error has occurred</span>;

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      <div className="w-full flex flex-1 align-start">
        <div className="w-16">
          <div className="w-full h-full flex-wrap py-5 text-white bg-zinc-800">
            <div className="w-full flex justify-center my-auto ">
              <Button
                icon="pi pi-plus"
                className="p-button-outlined p-button-rounded p-button-plain"
                tooltip="New Project"
                onClick={() =>
                  createProjectMutation.mutate({
                    id: uuid(),
                    title: "New Project",
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-wrap items-start justify-start px-6 py-4 pl-6 gap-x-6">
          {projects &&
            projects.map((project: ProjectType) => (
              <ProjectCard key={project.id} {...project} />
            ))}
        </div>
      </div>
    </div>
  );
}
