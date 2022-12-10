import { List, Map } from "immutable";
import React, { useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useParams } from "react-router-dom";

import { useGetItem } from "../../hooks/getItemHook";
import { BoardType } from "../../types/boardTypes";

type Props = {};

export default function BoardView({}: Props) {
  const { project_id, item_id } = useParams();
  const board = useGetItem(project_id as string, item_id as string, "boards") as BoardType;

  const elements = [...board.nodes, ...board.edges];

  return (
    <div className="h-full w-full">
      {/* @ts-ignore */}
      <CytoscapeComponent className="h-full w-full" elements={elements} />
    </div>
  );
}
