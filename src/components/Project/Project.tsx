import { Navigate, Outlet, useParams } from "react-router-dom";
import {
  useGetBoards,
  useGetDocuments,
  useGetMaps,
  useGetProjectData,
} from "../../utils/customHooks";
import { auth } from "../../utils/supabaseUtils";
import FilebrowserProvider from "../Context/FileBrowserContext";
import MediaQueryProvider from "../Context/MediaQueryContext";
import SidebarProvider from "../Context/SidebarContext";
import Navbar from "../Nav/Navbar";
import LoadingScreen from "../Util/LoadingScreen";

export default function Project() {
  const { project_id } = useParams();
  const project = useGetProjectData(project_id as string);
  const { isLoading: isLoadingDocuments } = useGetDocuments(
    project_id as string
  );
  const { isLoading: isLoadingMaps } = useGetMaps(project_id as string);
  const { isLoading: isLoadingBoards } = useGetBoards(project_id as string);
  const user = auth.user();

  if (!user) return <Navigate to="/" />;

  if (isLoadingDocuments || isLoadingMaps || isLoadingBoards)
    return <LoadingScreen />;

  return (
    <>
      <MediaQueryProvider>
        <SidebarProvider>
          <FilebrowserProvider>
            <Navbar />
            <Outlet />
          </FilebrowserProvider>
        </SidebarProvider>
      </MediaQueryProvider>
    </>
  );
}
