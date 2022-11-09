import { Outlet, useParams } from "react-router-dom";
import { useGetSingleProject } from "../../CRUD/ProjectCRUD";
import Navbar from "../Nav/Navbar";
import Sidebar from "../Sidebar/Sidebar";

type Props = {};

export default function Layout({}: Props) {
  const { project_id } = useParams();
  const data = useGetSingleProject(project_id as string);
  return (
    <div className="flex flex-col flex-1">
      <div className="w-full">
        <Navbar />
      </div>
      <div className="flex flex-1">
        <Sidebar />
        <div className="w-full outletWrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
