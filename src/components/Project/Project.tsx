import { useQuery } from "react-query";
import { Outlet, useParams } from "react-router-dom";
import { getCurrentProject } from "../../utils/supabaseUtils";
import Navbar from "../Nav/Navbar";
import LoadingScreen from "../Util/LoadingScreen";
export default function Project() {
  const { project_id } = useParams();

  const { error: projectError, isLoading: projectLoading } = useQuery(
    `${project_id}-project`,
    async () => await getCurrentProject(project_id as string)
  );

  if (projectError || projectLoading) return <LoadingScreen />;
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
