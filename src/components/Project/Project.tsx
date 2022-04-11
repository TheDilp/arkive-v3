import { useQuery } from "react-query";
import { Outlet, useParams } from "react-router-dom";
import { getCurrentProject, getDocuments } from "../../utils/supabaseUtils";
import Navbar from "../Nav/Navbar";
import LoadingScreen from "../Util/LoadingScreen";
export default function Project() {
  const { project_id } = useParams();
  const {
    data: documentsData,
    error: documentsError,
    isLoading,
  } = useQuery(
    `${project_id}-documents`,
    async () => await getDocuments(project_id as string),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
  const {
    data: currentProject,
    error: projectError,
    isLoading: projectLoading,
  } = useQuery(
    `${project_id}-project`,
    async () => await getCurrentProject(project_id as string)
  );

  if (isLoading || documentsError || projectError || projectLoading)
    return <LoadingScreen />;
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
