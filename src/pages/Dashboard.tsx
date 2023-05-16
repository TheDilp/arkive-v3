import { SignedIn, useUser } from "@clerk/clerk-react";
import { useSetAtom } from "jotai";

import ProjectCard from "../components/Card/ProjectCard";
import Navbar from "../components/Nav/Navbar";
import { DashboardSidebar } from "../components/Sidebar/Sidebar";
import { ProjectCardSkeleton } from "../components/Skeleton/Skeleton";
import { useGetUser } from "../CRUD/AuthCRUD";
import { useGetAllProjects } from "../CRUD/ProjectCRUD";
import { useBreakpoint } from "../hooks/useMediaQuery";
import { MemberType } from "../types/generalTypes";
import { ProjectType } from "../types/ItemTypes/projectTypes";
import { UserType } from "../types/userTypes";
import { UserAtom } from "../utils/Atoms/atoms";

export default function Dashboard() {
  const { user } = useUser();
  const { isLg } = useBreakpoint();

  const setUserAtom = useSetAtom(UserAtom);
  useGetUser(
    user?.id as string,
    {
      enabled: !!user,
      onSuccess: (data) => {
        if (data) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { members, ...userData } = data as UserType & { members: MemberType[] };
          setUserAtom(userData);
        }
      },
    },
    false,
  );

  const { isLoading, error, data: projects } = useGetAllProjects(!!user);

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
                  <ProjectCardSkeleton /> <ProjectCardSkeleton /> <ProjectCardSkeleton /> <ProjectCardSkeleton />
                  <ProjectCardSkeleton />
                </>
              ) : null}
              {!isLoading
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
