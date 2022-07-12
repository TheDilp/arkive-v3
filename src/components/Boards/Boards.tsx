import { useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import { useGetBoards } from "../../utils/customHooks";
import BoardRefsProvider from "../Context/BoardRefsContext";
import LoadingScreen from "../Util/LoadingScreen";
import BoardsTree from "./BoardsTree/BoardsTree";
import BoardView from "./BoardView";
export default function Boards() {
  const { project_id } = useParams();
  const { isLoading } = useGetBoards(project_id as string);
  const [boardId, setBoardId] = useState("");

  if (isLoading) return <LoadingScreen />;
  return (
    <div className="w-full flex flex-nowrap mainScreen">
      <BoardRefsProvider>
        <BoardsTree boardId={boardId} setBoardId={setBoardId} />
        <Routes>
          <Route path="/:board_id">
            <Route index element={<BoardView setBoardId={setBoardId} />} />
            <Route
              path=":node_id"
              element={<BoardView setBoardId={setBoardId} />}
            />
          </Route>
        </Routes>
      </BoardRefsProvider>
    </div>
  );
}
