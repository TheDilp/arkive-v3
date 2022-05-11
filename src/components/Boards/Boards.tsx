import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useGetBoards } from "../../utils/customHooks";
import LoadingScreen from "../Util/LoadingScreen";
import BoardsTree from "./BoardsTree/BoardsTree";
import BoardView from "./BoardView";

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
    <div className="w-full h-screen flex flex-nowrap">
      <BoardsTree boardId={boardId} cyRef={cyRef} />
      <div className="w-10 h-full relative">
        <Routes>
          <Route
            path="/:board_id"
            element={<BoardView setBoardId={setBoardId} cyRef={cyRef} />}
          />
        </Routes>
      </div>
    </div>
  );
}
