import { ConfirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import DialogWrapper from "../Dialog/DialogWrapper";
import Drawer from "../Drawer/Drawer";
import Navbar from "../Nav/Navbar";
import SecondarySidebar from "../Sidebar/SecondarySidebar";
import Sidebar from "../Sidebar/Sidebar";

export default function Layout() {
  const user = useAuth();
  if (!user) return <ProgressSpinner />;
  return (
    <div className="flex h-full max-w-full overflow-hidden bg-black">
      <ConfirmDialog />

      <DialogWrapper />
      <Sidebar />
      <SecondarySidebar />
      <Drawer />

      <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
        <Navbar />
        <Suspense fallback={<ProgressSpinner />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
