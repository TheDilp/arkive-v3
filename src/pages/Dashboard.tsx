import { ProgressSpinner } from "primereact/progressspinner";
import { useState } from "react";

import ProjectCard from "../components/Card/ProjectCard";
import Navbar from "../components/Nav/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import { useGetUser } from "../CRUD/AuthCRUD";
import { useGetAllProjects } from "../CRUD/ProjectCRUD";
import { useAuth } from "../hooks/useAuth";
import { ProjectType } from "../types/ItemTypes/projectTypes";
import { UserType } from "../types/userTypes";

export default function Dashboard() {
  const user = useAuth();
  const [userData, setUserData] = useState<null | UserType>(null);

  const { isFetching } = useGetUser(
    user as string,
    {
      enabled: !!user,
      staleTime: 5 * 60 * 1000,
      onSuccess: (data) => {
        setUserData(data as UserType);
      },
    },
    false,
  );
  const { isLoading, error, data: projects } = useGetAllProjects(!!user);
  if (isLoading || isFetching)
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
              ? projects?.map((project: ProjectType) => (
                  <ProjectCard key={project.id} {...project} user_id={userData?.id || ""} />
                ))
              : "Click the button on the left to create a new project."}
          </div>
        </div>
      </div>
    </div>
  );
}
