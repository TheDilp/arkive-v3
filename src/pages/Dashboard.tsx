import { SignedIn, useUser } from "@clerk/clerk-react";
import { useSetAtom } from "jotai";
import { useLayoutEffect } from "react";

import ProjectCard from "../components/Card/ProjectCard";
import Navbar from "../components/Nav/Navbar";
import { DashboardSidebar } from "../components/Sidebar/Sidebar";
import { ProjectCardSkeleton } from "../components/Skeleton/Skeleton";
import { useGetUser } from "../CRUD/AuthCRUD";
import { useGetAllProjects } from "../CRUD/ProjectCRUD";
import { useBreakpoint } from "../hooks/useMediaQuery";
import { ProjectType } from "../types/ItemTypes/projectTypes";
import { UserType } from "../types/userTypes";
import { UserAtom } from "../utils/Atoms/atoms";
import { setTabTitle } from "../utils/uiUtils";

export default function Dashboard() {
  const { user } = useUser();
  const { isLg } = useBreakpoint();

  const setUserAtom = useSetAtom(UserAtom);
  const { data: userData } = useGetUser(
    user?.id as string,
    {
      enabled: !!user,
      staleTime: 1000 * 60 * 5,
      onSuccess: (data) => {
        if (data) {
          setUserAtom(data as UserType);
        }
      },
    },
    false,
  );

  const { isLoading, isFetched, error, data: projects } = useGetAllProjects(userData?.id as string, !!user && !!userData?.id);

  useLayoutEffect(() => {
    setTabTitle(undefined);
  }, []);

  if (error) return <span>An error has occurred</span>;
  return (
    <SignedIn>
      <div className="flex h-full w-full flex-col overflow-y-auto">
        <div className="align-start flex w-full flex-1 flex-col">
          <Navbar />
          <div className="flex h-full w-full flex-col overflow-hidden lg:flex-row">
            {isLg ? <DashboardSidebar /> : null}
            <div className="flex w-full flex-1 flex-wrap items-start justify-start gap-x-6 gap-y-6 px-6 py-4 pl-6">
              {isLoading ? (
                <>
                  <ProjectCardSkeleton /> <ProjectCardSkeleton /> <ProjectCardSkeleton />
                </>
              ) : null}
              {!isLoading && projects && projects.length
                ? projects?.map((project: ProjectType) => <ProjectCard key={project.id} {...project} />)
                : null}
              {projects?.length === 0 && isFetched ? (
                <span className="text-lg">Click the plus button to create a new project.</span>
              ) : null}
            </div>
            {!isLg ? <DashboardSidebar /> : null}
          </div>
        </div>
      </div>
    </SignedIn>
  );
}
