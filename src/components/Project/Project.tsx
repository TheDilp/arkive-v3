import { Outlet, useParams } from "react-router-dom";
import { useGetProjectData } from "../../utils/customHooks";
import LoadingScreen from "../Util/LoadingScreen";
import Navbar from "../Nav/Navbar";
export default function Project() {
  const { project_id } = useParams();
  const project = useGetProjectData(project_id as string);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
