import { Outlet, useParams } from "react-router-dom";
import {
  useGetDocuments,
  useGetMaps,
  useGetProjectData,
} from "../../utils/customHooks";
import LoadingScreen from "../Util/LoadingScreen";
import Navbar from "../Nav/Navbar";
export default function Project() {
  const { project_id } = useParams();
  const project = useGetProjectData(project_id as string);
  if (!project) return <LoadingScreen />;

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
