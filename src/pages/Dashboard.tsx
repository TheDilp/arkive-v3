import { Button } from "primereact/button";
import { v4 as uuid } from "uuid";
import ProjectCard from "../components/Card/Card";
import { useCreateProject, useGetAllProjects } from "../CRUD/ProjectCRUD";
import { ProjectType } from "../types/projectTypes";

type Props = {};

export default function Dashboard({}: Props) {
  const { isLoading, error, data: projects } = useGetAllProjects();

  const createProjectMutation = useCreateProject();
  if (isLoading) return <span> "Loading..." </span>;

  if (error) return <span> "An error has occurred" </span>;

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      <div className={`flex w-full flex-1 align-start`}>
        <div className={"w-16"}>
          <div
            className={"w-full py-5 h-full bg-zinc-800 text-white flex-wrap"}
          >
            <div className="w-full flex justify-center my-auto ">
              {/* <Button
                icon="pi pi-plus"
                className="p-button-outlined p-button-rounded p-button-plain"
                tooltip="New Project"
                onClick={() =>
                  createProjectMutation.mutate({
                    id: uuid(),
                    title: "New Project",
                  })
                }
              /> */}
            </div>
          </div>
        </div>
        <div
          className={
            "items-start px-6 flex-wrap pl-6 flex w-full py-4 gap-x-6 justify-start"
          }
        >
          {projects &&
            projects.map((project: ProjectType) => (
              <ProjectCard key={project.id} {...project} />
            ))}
        </div>
      </div>
    </div>
  );
}
