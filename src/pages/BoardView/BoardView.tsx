import { EdgeDefinition, NodeDefinition } from "cytoscape";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";

import ContextMenu from "../../components/ContextMenu/ContextMenu";
import BoardQuickBar from "../../components/QuickBar/QuickBar";
import { useCreateNode, useUpdateMany } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/getItemHook";
import { BoardType, EdgeType, NodeType } from "../../types/boardTypes";
import { BoardReferenceAtom } from "../../utils/Atoms/atoms";
import { changeLockState } from "../../utils/boardUtils";
import { cytoscapeStylesheet, DefaultNode } from "../../utils/DefaultValues/BoardDefaults";
import { toaster } from "../../utils/toast";

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
  const [elements, setElements] = useState<(NodeDefinition | EdgeDefinition)[]>([]);
  const board = useGetItem(project_id as string, item_id as string, "boards") as BoardType;
  const createNodeMutation = useCreateNode(project_id as string, "nodes");
  const updateManyNodes = useUpdateMany("nodes");
  const items = [
    {
      command: () => {
        if (boardContext.x && boardContext.y)
          createNodeMutation.mutate({
            ...DefaultNode,
            x: boardContext.x,
            y: boardContext.y,
            parent: item_id as string,
            id: v4(),
          });
        else toaster("error", "There was an error creating your node (missing X and Y).");
      },
      icon: "pi pi-fw pi-map-marker",
      label: "New Node",
    },
    {
      label: "Un/Lock Nodes",
      items: [
        {
          label: "Unlock Selected",
          icon: "pi pi-fw pi-lock",
          command: () => {
            if (boardRef) changeLockState(boardRef, false, updateManyNodes);
          },
        },
        {
          label: "Lock Selected",
          icon: "pi pi-fw pi-unlock",
          command: () => {
            if (boardRef) changeLockState(boardRef, true, updateManyNodes);
          },
        },
      ],
    },
    {
      label: "View",
      items: [
        {
          label: "Go to center of nodes",
        },
        {
          label: "Fit view to nodes",
        },
      ],
    },
    {
      label: "Quick Create",
      items: [
        {
          label: "From Document",
        },
      ],
    },
    { separator: true },
    {
      label: "Delete Selected Nodes",
    },
  ];

  useEffect(() => {
    if (board) {
      let temp_nodes: NodeDefinition[] = [];
      let temp_edges: EdgeDefinition[] = [];
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
      if (board.edges.length > 0) {
        temp_edges = board.edges.map((edge: EdgeType) => ({
          data: {
            ...edge,
            source: edge.source_id,
            target: edge.target_id,
            classes: "boardEdge",
            label: edge.label || "",
          },
        }));
      }
      setElements([...temp_nodes, ...temp_edges]);
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
