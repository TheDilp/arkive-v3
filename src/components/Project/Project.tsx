import { Outlet, useParams } from "react-router-dom";
import {
  useGetBoards,
  useGetDocuments,
  useGetProjectData,
} from "../../utils/customHooks";
import LoadingScreen from "../Util/LoadingScreen";
import Navbar from "../Nav/Navbar";
import { useEffect } from "react";
import cytoscape from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import dagre from "cytoscape-dagre";
export default function Project() {
  const { project_id } = useParams();
  const project = useGetProjectData(project_id as string);
  const { isLoading: isLoadingDocuments } = useGetDocuments(
    project_id as string
  );
  // const { isLoading: isLoadingMaps } = useGetMaps(project_id as string);
  const { isLoading: isLoadingBoards } = useGetBoards(project_id as string);

  useEffect(() => {
    cytoscape.use(edgehandles);
    cytoscape.use(dagre);
  }, []);
  if (isLoadingDocuments || isLoadingBoards) return <LoadingScreen />;

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
