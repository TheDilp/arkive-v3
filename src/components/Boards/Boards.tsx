import { useEffect, useRef, useState } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useGetBoards } from "../../utils/customHooks";
import LoadingScreen from "../Util/LoadingScreen";
import BoardsTree from "./BoardsTree/BoardsTree";
import BoardView from "./BoardView";
import cytoscape from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import gridguide from "cytoscape-grid-guide";
export default function Boards() {
  const { project_id } = useParams();
  const { isLoading } = useGetBoards(project_id as string);
  const [boardId, setBoardId] = useState("");
  const cyRef = useRef() as any;
  const navigate = useNavigate();
  useEffect(() => {
    if (boardId) {
      navigate(boardId);
    }
  }, [boardId]);

  if (isLoading) return <LoadingScreen />;
  return (
    <div className="w-full flex flex-nowrap mainScreen">
      <BoardsTree boardId={boardId} setBoardId={setBoardId} cyRef={cyRef} />
      <Routes>
        <Route
          path="/:board_id"
          element={<BoardView setBoardId={setBoardId} cyRef={cyRef} />}
        />
      </Routes>
    </div>
  );
}
