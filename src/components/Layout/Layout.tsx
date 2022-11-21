import { Outlet } from "react-router-dom";
import DialogWrapper from "../Dialog/DialogWrapper";
import Drawer from "../Drawer/Drawer";
import Navbar from "../Nav/Navbar";
import Sidebar from "../Sidebar/Sidebar";

export default function Layout() {
  return (
    <div className="flex flex-col flex-1">
      <DialogWrapper />
      <div className="w-full">
        <Navbar />
      </div>
      <div className="w-full flex flex-1">
        <Drawer />
        <div className="w-1/6 flex flex-col max-w-[20%]">
          <Sidebar />
        </div>
        {/* <div className="w-5/6 outletWrapper"> */}
        <div className="h-full flex flex-1">
          <div className="flex flex-col flex-1">
            <Outlet />
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
