import { ConfirmDialog } from "primereact/confirmdialog";
import { Outlet } from "react-router-dom";

import DialogWrapper from "../Dialog/DialogWrapper";
import Drawer from "../Drawer/Drawer";
import Navbar from "../Nav/Navbar";
import Sidebar from "../Sidebar/Sidebar";

export default function Layout() {
  return (
    <div className="flex flex-1 flex-col">
      <ConfirmDialog />

      <DialogWrapper />
      <div className="w-full">
        <Navbar />
      </div>
      <div className="flex w-full flex-1">
        <Drawer />
        <div className="flex w-1/6 max-w-[20%] flex-col">
          <Sidebar />
        </div>
        <div className="flex h-full flex-1">
          <div className="flex flex-1 flex-col">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
