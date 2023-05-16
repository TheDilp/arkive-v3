import { SignedIn, useUser } from "@clerk/clerk-react";
import { useAtomValue, useSetAtom } from "jotai";
import { KBarProvider } from "kbar";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Suspense, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { useGetSingleProject } from "../../CRUD/ProjectCRUD";
import { useBreakpoint } from "../../hooks/useMediaQuery";
import { ProjectType } from "../../types/ItemTypes/projectTypes";
import { PendingUpdatesAtom, PermissionAtom, ProjectAtom } from "../../utils/Atoms/atoms";
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

  const setProjectAtom = useSetAtom(ProjectAtom);
  const setPermissionAtom = useSetAtom(PermissionAtom);
  const pendingUpdates = useAtomValue(PendingUpdatesAtom);
  const { data: projectData, isFetching: isFetchingProject } = useGetSingleProject(project_id as string, {
    enabled: !!user,
    onSuccess: (data) => {
      setProjectAtom(data as ProjectType);
    },
  });

  useEffect(() => {
    if (projectData) {
      setProjectAtom(projectData as ProjectType);
      if (projectData.ownerId === user?.id) setPermissionAtom("owner");
      if (projectData.members.some((member) => member.user_id === user?.id)) setPermissionAtom("member");
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
            <SecondarySidebar />
            <Drawer />
          </>
        ) : null}

        <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
          <KBarProvider actions={CMDKActions(navigate, project_id as string, pendingUpdates)}>
            <Navbar />
            <CmdK />
            {user || isFetchingProject ? (
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
