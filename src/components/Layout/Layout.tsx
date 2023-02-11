import { useAtom } from "jotai";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Suspense } from "react";
import { Outlet, useParams } from "react-router-dom";

import { useGetUser } from "../../CRUD/AuthCRUD";
import { useGetSingleProject } from "../../CRUD/ProjectCRUD";
import { useAuth } from "../../hooks/useAuth";
import { MemberType } from "../../types/generalTypes";
import { UserType } from "../../types/userTypes";
import { UserAtom } from "../../utils/Atoms/atoms";
import DialogWrapper from "../Dialog/DialogWrapper";
import Drawer from "../Drawer/Drawer";
import LoadingScreen from "../Loading/LoadingScreen";
import Navbar from "../Nav/Navbar";
import SecondarySidebar from "../Sidebar/SecondarySidebar";
import Sidebar from "../Sidebar/Sidebar";

export default function Layout() {
  const { project_id } = useParams();
  const user = useAuth();
  const [, setUserAtom] = useAtom(UserAtom);
  const { data: projectData, isFetching: isFetchingProject } = useGetSingleProject(project_id as string, {
    enabled: !!user,
  });

  const { isFetching } = useGetUser(
    user as string,
    {
      enabled: !!user && !isFetchingProject,
      onSuccess: (data) => {
        if (data) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { members, ...userData } = data as UserType & { members: MemberType[] };
          setUserAtom({ ...userData, permission: projectData?.ownerId === user ? "owner" : "member" });
        }
      },
    },
    false,
  );
  return (
    <div className="flex h-full max-w-full overflow-hidden">
      <Sidebar />

      {user ? (
        <>
          <ConfirmDialog />

          <DialogWrapper />
          <SecondarySidebar />
          <Drawer />
        </>
      ) : null}

      <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
        <Navbar />
        {user || isFetching || isFetchingProject ? (
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
}
