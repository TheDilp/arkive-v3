import React from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Board } from "../../../custom-types";

type Props = {
  boardId: string;
  setBoardId: (boardId: string) => void;
};

export default function BoardsTree({ boardId, setBoardId }: Props) {
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const boards: Board[] | undefined = queryClient.getQueryData<Board[]>(
    `${project_id}-boards`
  );
  return (
    <div>
      <ul>
        {boards?.map((board) => (
          <li key={board.id} onClick={() => setBoardId(board.id)}>
            {board.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
