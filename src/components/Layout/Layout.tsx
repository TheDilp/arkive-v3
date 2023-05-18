import { SignedIn, useUser } from "@clerk/clerk-react";
import { useAtom, useSetAtom } from "jotai";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Suspense, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";

import { useGetUser } from "../../CRUD/AuthCRUD";
import { useGetSingleProject } from "../../CRUD/ProjectCRUD";
import { useBreakpoint } from "../../hooks/useMediaQuery";
import { MemberType } from "../../types/generalTypes";
import { ProjectType } from "../../types/ItemTypes/projectTypes";
import { UserType } from "../../types/userTypes";
import { ProjectAtom, UserAtom } from "../../utils/Atoms/atoms";
import DialogWrapper from "../Dialog/DialogWrapper";
import Drawer from "../Drawer/Drawer";
import LoadingScreen from "../Loading/LoadingScreen";
import Navbar from "../Nav/Navbar";
import SecondarySidebar from "../Sidebar/SecondarySidebar";
import Sidebar from "../Sidebar/Sidebar";

export default function LayoutWrapper() {
  const { project_id, type } = useParams();
  const { user } = useUser();
  const { isLg } = useBreakpoint();

  const [userData, setUserAtom] = useAtom(UserAtom);
  useGetUser(
    user?.id as string,
    {
      enabled: !!user && !userData,
      staleTime: 1000 * 60 * 5,
      onSuccess: (data) => {
        if (data) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { members, ...rest } = data as UserType & { members: MemberType[] };
          setUserAtom(rest);
        }
      },
    },
    false,
  );
  const setProjectAtom = useSetAtom(ProjectAtom);
  const { data: projectData, isFetching: isFetchingProject } = useGetSingleProject(project_id as string, {
    enabled: !!user,
    onSuccess: (data) => {
      setProjectAtom(data as ProjectType);
    },
  });
  useEffect(() => {
    if (projectData) {
      setProjectAtom(projectData as ProjectType);
    }
  }, [projectData, project_id]);
  return (
    <SignedIn>
      <div className="flex h-full max-w-full overflow-hidden">
        {isLg ? <Sidebar /> : null}

        {user ? (
          <>
            <ConfirmDialog />
            <DialogWrapper />
            {type && type !== "entity_instances" ? <SecondarySidebar /> : null}
            <Drawer />
          </>
        ) : null}

        <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
          <Navbar />
          {user || isFetchingProject ? (
            <Suspense fallback={<LoadingScreen />}>
              <Outlet />
            </Suspense>
          ) : null}
          {!isLg ? <Sidebar /> : null}
        </div>
      </div>
    </SignedIn>
  );
}
