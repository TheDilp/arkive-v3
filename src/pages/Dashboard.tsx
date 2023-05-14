import { SignedIn, useUser } from "@clerk/clerk-react";
import { ProgressSpinner } from "primereact/progressspinner";

import ProjectCard from "../components/Card/ProjectCard";
import Navbar from "../components/Nav/Navbar";
import { DashboardSidebar } from "../components/Sidebar/Sidebar";
import { useGetAllProjects } from "../CRUD/ProjectCRUD";
import { useBreakpoint } from "../hooks/useMediaQuery";
import { ProjectType } from "../types/ItemTypes/projectTypes";

export default function Dashboard() {
  const user = useUser();
  const { isLg } = useBreakpoint();
  const { isLoading, error, data: projects } = useGetAllProjects(!!user);

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ProgressSpinner />
      </div>
    );

  if (error) return <span>An error has occurred</span>;

  return (
    <SignedIn>
      <div className="flex h-full w-full flex-col overflow-y-auto">
        <div className="align-start flex w-full flex-1 flex-col">
          <Navbar />
          <div className="flex h-full w-full flex-col overflow-hidden lg:flex-row">
            {isLg ? <DashboardSidebar /> : null}
            <div className="flex w-full flex-1 flex-wrap items-start justify-start gap-x-6 gap-y-6 px-6 py-4 pl-6">
              {projects?.length
                ? projects?.map((project: ProjectType) => <ProjectCard key={project.id} {...project} />)
                : "Click the button on the left to create a new project."}
            </div>
            {!isLg ? <DashboardSidebar /> : null}
          </div>
        </div>
      </div>
    </SignedIn>
  );
}
