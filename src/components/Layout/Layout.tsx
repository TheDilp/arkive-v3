import { Outlet, useParams } from "react-router-dom";
import Navbar from "../Nav/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { useGetSingleProject } from "../../CRUD/ProjectCRUD";
import Drawer from "../Drawer/Drawer";

export default function Layout() {
  const { project_id } = useParams();
  const data = useGetSingleProject(project_id as string);
  return (
    <div className="flex flex-col flex-1">
      <div className="w-full">
        <Navbar />
      </div>
      <div className="flex flex-1">
        <Drawer />
        <Sidebar />
        <div className="w-full outletWrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
