import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useGetBoards } from "../../utils/customHooks";
import BoardRefsProvider from "../Context/BoardRefsContext";
import LoadingScreen from "../Util/LoadingScreen";
import BoardsTree from "./BoardsTree/BoardsTree";
import BoardView from "./BoardView";
export default function Boards() {
  const { project_id } = useParams();
  const { isLoading } = useGetBoards(project_id as string);
  const [boardId, setBoardId] = useState("");

  // Ref for accessing the cytoscape board
  const navigate = useNavigate();
  useEffect(() => {
    if (boardId) {
      navigate(boardId);
    }
  }, [boardId, navigate]);

  if (isLoading) return <LoadingScreen />;
  return (
    <div className="w-full flex flex-nowrap mainScreen">
      <BoardRefsProvider>
        <BoardsTree boardId={boardId} setBoardId={setBoardId} />
        <Routes>
          <Route
            path="/:board_id"
            element={<BoardView setBoardId={setBoardId} />}
          />
        </Routes>
      </BoardRefsProvider>
    </div>
  );
}
