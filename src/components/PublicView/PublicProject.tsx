import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { getSingleBoard } from "../../utils/supabaseUtils";

type Props = {};

export default function PublicProject({}: Props) {
  const { board_id } = useParams();
  async function name() {
    const d = await getSingleBoard(board_id as string);
  }
  return (
    <div className="w-screen h-screen">
      <Outlet />
    </div>
  );
}
