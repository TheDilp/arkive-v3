import { Outlet, useParams } from "react-router-dom";
import {
  useGetBoards,
  useGetDocuments,
  useGetProjectData,
} from "../../utils/customHooks";
import LoadingScreen from "../Util/LoadingScreen";
import Navbar from "../Nav/Navbar";
import { DndProvider } from "react-dnd";
import { getBackendOptions, MultiBackend } from "@minoru/react-dnd-treeview";

export default function Project() {
  const { project_id } = useParams();
  const project = useGetProjectData(project_id as string);
  const { isLoading: isLoadingDocuments } = useGetDocuments(
    project_id as string
  );
  const { isLoading: isLoadingBoards } = useGetBoards(project_id as string);

  if (isLoadingDocuments || isLoadingBoards) return <LoadingScreen />;

  return (
    <>
      <Navbar />
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Outlet />
      </DndProvider>
    </>
  );
}
