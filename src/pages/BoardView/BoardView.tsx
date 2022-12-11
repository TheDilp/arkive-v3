import cytoscape from "cytoscape";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";

import ContextMenu from "../../components/ContextMenu/ContextMenu";
import BoardQuickBar from "../../components/QuickBar/QuickBar";
import { useCreateNode } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/getItemHook";
import { BoardType, NodeType } from "../../types/boardTypes";
import { BoardReferenceAtom } from "../../utils/Atoms/atoms";
import { cytoscapeStylesheet, DefaultNode } from "../../utils/DefaultValues/BoardDefaults";

type Props = {};

export default function BoardView({}: Props) {
  const cm = useRef() as any;
  const { project_id, item_id } = useParams();
  const [boardRef, setBoardRef] = useAtom(BoardReferenceAtom);
  const [boardContext, setBoardContext] = useState<{ x: null | number; y: null | number; type: "node" | "edge" }>({
    x: null,
    y: null,
    type: "node",
  });
  const [elements, setElements] = useState([]);
  const board = useGetItem(project_id as string, item_id as string, "boards") as BoardType;
  const createNodeMutation = useCreateNode(project_id as string, "nodes");
  const items = [
    {
      command: () => {
        createNodeMutation.mutate({
          ...DefaultNode,
          x: boardContext.x,
          y: boardContext.y,
          parent: item_id as string,
          id: v4(),
        });
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
    if (board) {
      let temp_nodes = [];
      const temp_edges = [];
      if (board.nodes.length > 0) {
        temp_nodes = board.nodes
          .filter((node) => !node.template)
          .map((node: NodeType) => ({
            data: {
              ...node,
              classes: "boardNode",
              label: node.label || "",
              zIndexCompare: node.zIndex === 0 ? "manual" : "auto",
              backgroundImage: [],
              // Custom image has priority, if not set use document image, if neither - empty array
              // Empty string ("") causes issues with cytoscape, so an empty array must be used
              // backgroundImage: node.customImage?.link
              //   ? `${supabaseStorageImagesLink}${node.customImage.link.replaceAll(" ", "%20")}`
              //   : node.document?.image?.link
              //   ? `${supabaseStorageImagesLink}${node.document.image.link?.replaceAll(" ", "%20")}`
              //   : [],
            },
            scratch: {
              doc_id: node?.doc_id,
            },
            locked: node.locked,
            position: { x: node.x, y: node.y },
          }));
      }
      setElements([...temp_nodes]);
    }
  }, [board, item_id]);

  // Board Events
  useEffect(() => {
    if (boardRef) {
      boardRef.on("cxttap", function (evt: any) {
        // If the target is the background of the canvas
        if (evt.target === boardRef) {
          cm.current.show(evt.originalEvent);
          setBoardContext({
            ...evt.position,
            type: "node",
          });
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
      <CytoscapeComponent
        className="h-full w-full"
        cy={(cy) => setBoardRef(cy)}
        elements={elements}
        // @ts-ignore
        stylesheet={cytoscapeStylesheet}
      />
      <BoardQuickBar />
    </div>
  );
}
