import { getBackendOptions, MultiBackend } from "@minoru/react-dnd-treeview";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { ImageProps } from "../../custom-types";
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

  const cacheImages = async (imgArray: ImageProps[]) => {
    const promises = await imgArray.map((image) => {
      return new Promise(function (resolve, reject) {
        const img = new Image();
        img.src = supabaseStorageImagesLink + image.link;
        img.onload = () => resolve(image.link);
        img.onerror = () => reject();
      });
    });
    await Promise.all(promises);
  };

  useEffect(() => {
    if (images?.data) {
      cacheImages(images.data);
    }
  }, [images?.data]);

  if (!user) return <Navigate to="/home" />;

  if (isLoadingDocuments || isLoadingMaps || isLoadingBoards)
    return <LoadingScreen />;

  return (
    <>
      <MediaQueryProvider>
        <ProjectContextProvider>
          <SidebarProvider>
            <FilebrowserProvider>
              <Navbar />
              <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                <Outlet />
              </DndProvider>
            </FilebrowserProvider>
          </SidebarProvider>
        </ProjectContextProvider>
      </MediaQueryProvider>
    </>
  );
}
