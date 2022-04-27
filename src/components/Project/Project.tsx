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
  const documents = useGetDocuments(project_id as string);
  const project = useGetProjectData(project_id as string);
  const maps = useGetMaps(project_id as string);
  if (!documents || !project || !maps) return <LoadingScreen />;

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
