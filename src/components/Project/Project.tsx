import { Outlet, useParams } from "react-router-dom";
import {
  useGetBoards,
  useGetDocuments,
  useGetMaps,
  useGetProjectData,
} from "../../utils/customHooks";
import LoadingScreen from "../Util/LoadingScreen";
import Navbar from "../Nav/Navbar";
export default function Project() {
  const { project_id } = useParams();
  const project = useGetProjectData(project_id as string);
  const { isLoading: isLoadingDocuments } = useGetDocuments(
    project_id as string
  );
  const { isLoading: isLoadingMaps } = useGetMaps(project_id as string);
  const { isLoading: isLoadingBoards } = useGetBoards(project_id as string);

  if (isLoadingDocuments || isLoadingMaps || isLoadingBoards)
    return <LoadingScreen />;

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
