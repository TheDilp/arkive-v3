import { Button } from "primereact/button";
import { v4 as uuid } from "uuid";
import ProjectCard from "../components/ProjectCard";
import { useCreateProject, useGetAllProjects } from "../CRUD/ProjectCRUD";

type Props = {};

export default function Dashboard({}: Props) {
  const { isLoading, error, data: projects } = useGetAllProjects();

  const createProjectMutation = useCreateProject();
  if (isLoading) return <span> "Loading..." </span>;

  if (error) return <span> "An error has occurred" </span>;

  return (
    <div className="Home w-full flex h-full flex-column overflow-y-auto">
      <div className={`flex w-full flex-grow-1 align-content-start`}>
        <div className={"w-4rem"}>
          <div
            className={"w-full py-5 h-full bg-gray-800 text-white flex-wrap"}
          >
            <div className="w-full flex justify-content-center my-auto ">
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
        <div
          className={
            "align-items-start px-6 flex-row flex-wrap pl-6 flex w-full py-4 gap-2 justify-content-start"
          }
        >
          {projects &&
            projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
        </div>
      </div>
    </div>
  );
}
