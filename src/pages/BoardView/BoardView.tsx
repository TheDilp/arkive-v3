import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";

import ContextMenu from "../../components/ContextMenu/ContextMenu";
import BoardQuickBar from "../../components/QuickBar/QuickBar";
import { useCreateNode } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/getItemHook";
import { BoardType } from "../../types/boardTypes";
import { BoardReferenceAtom } from "../../utils/Atoms/atoms";
import { DefaultNode } from "../../utils/DefaultValues/BoardDefaults";

type Props = {};

export default function BoardView({}: Props) {
  const cm = useRef() as any;
  const { project_id, item_id } = useParams();
  const [boardRef, setBoardRef] = useAtom(BoardReferenceAtom);
  const board = useGetItem(project_id as string, item_id as string, "boards") as BoardType;
  const createNodeMutation = useCreateNode(project_id as string, "nodes");
  const elements = [...board.nodes, ...board.edges];
  const items = [
    {
      command: () => {
        createNodeMutation.mutate({ ...DefaultNode, parent: item_id as string, id: v4() });
      },
      icon: "pi pi-fw pi-map-marker",
      label: "New Node",
    },
    {
      // command: () => mapRef?.current?.fitBounds(bounds),
      // label: "Fit Map",
    },
  ];

  useEffect(() => {
    if (boardRef) {
      boardRef.on("cxttap", function (evt: any) {
        // If the target is the background of the canvas
        if (evt.target === boardRef) {
          cm.current.show(evt.originalEvent);
        }
        // Else - the target is a node or an edge
        else {
          const { group } = evt.target._private;

          // If the current target is not in the selected group, make it the only selected item
          // This mimics a desktop mouse experience
          // Otherwise, do nothing
          if (!boardRef.elements(":selected").contains(evt.target)) {
            boardRef.elements(":selected").unselect();
            evt.target.select();
          }
          if (group === "nodes") {
            cm.current.show(evt.originalEvent);
          } else if (group === "edges") {
            cm.current.show(evt.originalEvent);
          }
        }
      });
    }
  }, [boardRef]);

  return (
    <div className="h-full w-full">
      <ContextMenu cm={cm} items={items} />
      {/* @ts-ignore */}
      <CytoscapeComponent className="h-full w-full" cy={(cy) => setBoardRef(cy)} elements={elements} />
      <BoardQuickBar />
    </div>
  );
}
