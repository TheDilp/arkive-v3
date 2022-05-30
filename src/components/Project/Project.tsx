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
import ProjectContextProvider from "../Context/ProjectContext";
import SidebarProvider from "../Context/SidebarContext";
import Navbar from "../Nav/Navbar";
import LoadingScreen from "../Util/LoadingScreen";
import cytoscape from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import gridguide from "cytoscape-grid-guide";
import { useEffect } from "react";
export default function Project() {
  const { project_id } = useParams();
  const project = useGetProjectData(project_id as string);
  const { isLoading: isLoadingDocuments } = useGetDocuments(
    project_id as string
  );
  const { isLoading: isLoadingMaps } = useGetMaps(project_id as string);
  const { isLoading: isLoadingBoards } = useGetBoards(project_id as string);
  const user = auth.user();

  useEffect(() => {
    cytoscape.use(gridguide);
    cytoscape.use(edgehandles);
  }, []);

  if (!user) return <Navigate to="/" />;

  if (isLoadingDocuments || isLoadingMaps || isLoadingBoards)
    return <LoadingScreen />;

  return (
    <>
      <MediaQueryProvider>
        <ProjectContextProvider>
          <SidebarProvider>
            <FilebrowserProvider>
              <Navbar />
              <Outlet />
            </FilebrowserProvider>
          </SidebarProvider>
        </ProjectContextProvider>
      </MediaQueryProvider>
    </>
  );
}
