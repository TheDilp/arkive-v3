import cytoscape from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import gridguide from "cytoscape-grid-guide";
import { useQuery } from "react-query";
import { Navigate, To, useParams } from "react-router-dom";
import { BoardProps } from "../../../custom-types";
import { auth, getSingleBoard } from "../../../utils/supabaseUtils";
import { toastWarn } from "../../../utils/utils";
import PublicBoardView from "./PublicBoardView";
export default function PublicBoardsContainer() {
  cytoscape.use(edgehandles);
  cytoscape.use(gridguide);
  const user = auth.user();
  const { board_id } = useParams();
  const { data: board, isLoading } = useQuery(
    board_id as string,
    async () => await getSingleBoard(board_id as string)
  );
  if (isLoading)
    return <h1 className="text-white w-full text-centerp">Loading Board...</h1>;
  if (!board || (!board.public && !user)) {
    toastWarn("This page is not public.");
  return <Navigate to={-1 as To} />;
  }
  return <PublicBoardView board={board as BoardProps} />;
}
