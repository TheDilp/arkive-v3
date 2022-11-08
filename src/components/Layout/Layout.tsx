import { Outlet, useParams } from "react-router-dom";
import { useGetSingleProject } from "../../CRUD/ProjectCRUD";
import Sidebar from "../Sidebar/Sidebar";

type Props = {};

export default function Layout({}: Props) {
  const { project_id } = useParams();
  const data = useGetSingleProject(project_id as string);
  return (
    <div className="flex flex-grow-1">
      <Sidebar />
      <div className="outletWrapper w-full">
        <Outlet />
      </div>
    </div>
  );
}
