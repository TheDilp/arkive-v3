import { useAtom } from "jotai";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { useGetUser } from "../../CRUD/AuthCRUD";
import { useAuth } from "../../hooks/useAuth";
import { UserType } from "../../types/userTypes";
import { UserAtom } from "../../utils/Atoms/atoms";
import DialogWrapper from "../Dialog/DialogWrapper";
import Drawer from "../Drawer/Drawer";
import LoadingScreen from "../Loading/LoadingScreen";
import Navbar from "../Nav/Navbar";
import SecondarySidebar from "../Sidebar/SecondarySidebar";
import Sidebar from "../Sidebar/Sidebar";

export default function Layout() {
  const user = useAuth();
  const [, setUserAtom] = useAtom(UserAtom);
  const { isFetching } = useGetUser(
    user as string,
    {
      enabled: !!user,
      onSuccess: (data) => {
        setUserAtom(data as UserType);
      },
    },
    false,
  );

  if (isFetching) return <LoadingScreen />;
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
        {user ? (
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
}
