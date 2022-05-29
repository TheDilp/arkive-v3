import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { BoardProps } from "../../../custom-types";
import { getSingleBoard } from "../../../utils/supabaseUtils";
import PublicBoardView from "./PublicBoardView";

type Props = {};

export default function PublicBoardsContainer({}: Props) {
  const { board_id } = useParams();
  const { data: board, isLoading } = useQuery(
    board_id as string,
    async () => await getSingleBoard(board_id as string)
  );
  if (isLoading)
    return <h1 className="text-white w-full text-center">Loading Board...</h1>;

  return <PublicBoardView board={board as BoardProps} />;
}
