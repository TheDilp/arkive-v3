import { SignedIn, useUser } from "@clerk/clerk-react";
import { useAtomValue, useSetAtom } from "jotai";
import { KBarProvider } from "kbar";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Suspense, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { useGetUser } from "../../CRUD/AuthCRUD";
import { useGetSingleProject } from "../../CRUD/ProjectCRUD";
import { useBreakpoint } from "../../hooks/useMediaQuery";
import { MemberType } from "../../types/generalTypes";
import { ProjectType } from "../../types/ItemTypes/projectTypes";
import { UserType } from "../../types/userTypes";
import { PendingUpdatesAtom, ProjectAtom, UserAtom } from "../../utils/Atoms/atoms";
import CmdK, { CMDKActions } from "../CmdK/CmdK";
import DialogWrapper from "../Dialog/DialogWrapper";
import Drawer from "../Drawer/Drawer";
import LoadingScreen from "../Loading/LoadingScreen";
import Navbar from "../Nav/Navbar";
import SecondarySidebar from "../Sidebar/SecondarySidebar";
import Sidebar from "../Sidebar/Sidebar";

export default function LayoutWrapper() {
  const { project_id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const { isLg } = useBreakpoint();
  const setUserAtom = useSetAtom(UserAtom);
  const setProjectAtom = useSetAtom(ProjectAtom);
  const pendingUpdates = useAtomValue(PendingUpdatesAtom);
  const { data: projectData, isFetching: isFetchingProject } = useGetSingleProject(project_id as string, {
    enabled: !!user,
    onSuccess: (data) => {
      setProjectAtom(data as ProjectType);
    },
  });

  const { isFetching } = useGetUser(
    user?.id as string,
    {
      enabled: !!user && !isFetchingProject,
      onSuccess: (data) => {
        if (data) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { members, ...userData } = data as UserType & { members: MemberType[] };
          setUserAtom({ ...userData, permission: projectData?.ownerId === user?.id ? "owner" : "member" });
        }
      },
    },
    false,
  );
  useEffect(() => {
    if (projectData) setProjectAtom(projectData as ProjectType);
  }, [projectData]);
  return (
    <SignedIn>
      <div className="flex h-full max-w-full overflow-hidden">
        {isLg ? <Sidebar /> : null}

        {user ? (
          <>
            <ConfirmDialog />
            <DialogWrapper />
            <SecondarySidebar />
            <Drawer />
          </>
        ) : null}

        <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
          <KBarProvider actions={CMDKActions(navigate, project_id as string, pendingUpdates)}>
            <Navbar />
            <CmdK />
            {user || isFetching || isFetchingProject ? (
              <Suspense fallback={<LoadingScreen />}>
                <Outlet />
              </Suspense>
            ) : null}
          </KBarProvider>
          {!isLg ? <Sidebar /> : null}
        </div>
      </div>
    </SignedIn>
  );
}
