import cytoscape from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import gridguide from "cytoscape-grid-guide";
import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import {
  useGetBoards,
  useGetDocuments,
  useGetImages,
  useGetMaps,
  useGetProjectData,
} from "../../utils/customHooks";
import { auth } from "../../utils/supabaseUtils";
import { supabaseStorageImagesLink } from "../../utils/utils";
import FilebrowserProvider from "../Context/FileBrowserContext";
import MediaQueryProvider from "../Context/MediaQueryContext";
import ProjectContextProvider from "../Context/ProjectContext";
import SidebarProvider from "../Context/SidebarContext";
import Navbar from "../Nav/Navbar";
import LoadingScreen from "../Util/LoadingScreen";
const Wiki = lazy(() => import("../Wiki/Wiki"));
const Maps = lazy(() => import("../Maps/Maps"));
const Boards = lazy(() => import("../Boards/Boards"));
const ProjectSettings = lazy(
  () => import("./ProjectSettings/ProjectSettingsIndex")
);
const FileBrowser = lazy(() => import("../FileBrowser/FileBrowser"));
const Timelines = lazy(() => import("../Timelines/TImelines"));
export default function Project() {
  const { project_id } = useParams();
  const project = useGetProjectData(project_id as string);
  const images = useGetImages(project_id as string);
  const { isLoading: isLoadingDocuments } = useGetDocuments(
    project_id as string
  );
  const { isLoading: isLoadingMaps } = useGetMaps(project_id as string);
  const { isLoading: isLoadingBoards } = useGetBoards(project_id as string);
  const user = auth.user();

  useEffect(() => {
    if (images?.data) {
      let maps = images.data.filter((image) => image.type === "Map");
      for (const map of maps) {
        let img = new Image();
        img.src = supabaseStorageImagesLink + map.link;
      }
    }
  }, []);

  useEffect(() => {
    cytoscape.use(edgehandles);
    cytoscape.use(gridguide);
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
              <Routes>
                <Route
                  path="wiki/*"
                  element={
                    <Suspense fallback={<LoadingScreen />}>
                      <Wiki />
                    </Suspense>
                  }
                />
                <Route
                  path="maps/*"
                  element={
                    <Suspense fallback={<LoadingScreen />}>
                      <Maps />
                    </Suspense>
                  }
                />
                <Route
                  path="boards/*"
                  element={
                    <Suspense fallback={<LoadingScreen />}>
                      <Boards />
                    </Suspense>
                  }
                />
                <Route
                  path="timelines/*"
                  element={
                    <Suspense fallback={<LoadingScreen />}>
                      <Timelines />
                    </Suspense>
                  }
                />
                <Route path="filebrowser" element={<FileBrowser />} />
                <Route path="settings/:setting" element={<ProjectSettings />} />
              </Routes>
            </FilebrowserProvider>
          </SidebarProvider>
        </ProjectContextProvider>
      </MediaQueryProvider>
    </>
  );
}
