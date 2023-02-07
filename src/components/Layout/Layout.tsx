import { ConfirmDialog } from "primereact/confirmdialog";
import { Outlet } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import DialogWrapper from "../Dialog/DialogWrapper";
import Drawer from "../Drawer/Drawer";
import Navbar from "../Nav/Navbar";
import SecondarySidebar from "../Sidebar/SecondarySidebar";
import Sidebar from "../Sidebar/Sidebar";

export default function Layout() {
  const user = useAuth();
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
        {user ? <Outlet /> : null}
      </div>
    </div>
  );
}
