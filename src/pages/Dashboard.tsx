import { SignedIn } from "@clerk/clerk-react";
import { ProgressSpinner } from "primereact/progressspinner";

import ProjectCard from "../components/Card/ProjectCard";
import Navbar from "../components/Nav/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import { useGetAllProjects } from "../CRUD/ProjectCRUD";
import { useAuth } from "../hooks/useAuth";
import useIsLocal from "../hooks/useIsLocal";
import { ProjectType } from "../types/ItemTypes/projectTypes";

function DashboardContent() {
  const user = useAuth();
  const isLocal = useIsLocal();

  const { isLoading, error, data: projects } = useGetAllProjects(!!user || isLocal);
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
        <Sidebar />
        <div className="w-full">
          <Navbar />
          <div className="flex w-full flex-wrap items-start justify-start gap-x-6 gap-y-6 px-6 py-4 pl-6">
            {projects?.length
              ? projects?.map((project: ProjectType) => <ProjectCard key={project.id} {...project} />)
              : "Click the button on the left to create a new project."}
          </div>
        </div>
      </div>
    </div>
  );
}
export default function Dashboard() {
  const isLocal = useIsLocal();
  if (isLocal) return <DashboardContent />;
  return (
    <SignedIn>
      <DashboardContent />
    </SignedIn>
  );
}
