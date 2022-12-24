import { useAtom } from "jotai";

import { useCreateSubItem, useDeleteManySubItems, useUpdateManySubItems } from "../CRUD/ItemsCRUD";
import { BoardContext, BoardContextType, BoardType } from "../types/boardTypes";
import { BoardReferenceAtom } from "./Atoms/atoms";
import { changeLockState } from "./boardUtils";
import { DefaultNode } from "./DefaultValues/BoardDefaults";
import { toaster } from "./toast";

export type BoardContextMenuType = {
  type: BoardContextType;
  boardContext: BoardContext;
  item_id: string;
  board: BoardType;
};

export function useBoardContextMenuItems({ type, boardContext, item_id, board }: BoardContextMenuType) {
  const [boardRef] = useAtom(BoardReferenceAtom);
  const updateManyNodes = useUpdateManySubItems(item_id, "nodes");
  const createNodeMutation = useCreateSubItem(item_id as string, "nodes", "boards");
  const deleteManyNodes = useDeleteManySubItems(item_id as string, "nodes");

  const deleteManyEdges = useDeleteManySubItems(item_id as string, "edges");

  const nodes = boardRef?.nodes(":selected");
  const edges = boardRef?.edges(":selected");
  if (type === "board")
    return [
      {
        command: () => {
          if (boardContext.x && boardContext.y)
            createNodeMutation.mutate({
              ...DefaultNode,
              type: board?.defaultNodeShape,
              backgroundColor: board?.defaultNodeColor,
              x: boardContext.x,
              y: boardContext.y,
              parent: item_id as string,
              id: crypto.randomUUID(),
            });
          else toaster("error", "There was an error creating your node (missing X and Y).");
        },
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
            command: () => boardRef?.center(),
          },
          {
            label: "Fit view to nodes",
            command: () => {
              if (boardRef)
                boardRef.animate(
                  {
                    fit: {
                      padding: 0,
                      eles: boardRef.nodes(),
                    },
                  },
                  {
                    duration: 1250,
                  },
                );
            },
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
        command: () => {
          if (boardRef) {
            const ids: string[] = boardRef.nodes(":selected").map((node: any) => node.data().id);
            deleteManyNodes.mutate(ids);
          }
        },
      },
    ];

  if (type === "nodes")
    return [
      {
        label: "Center Nodes",
        command: () => {
          if (boardRef && boardContext.nodes) boardRef.center(boardContext.nodes);
        },
      },
      {
        label: "Highlight Connected Nodes",
        command: () => {
          if (nodes) {
            const incomers = nodes.incomers();
            const outgoers = nodes.outgoers();
            incomers.nodes().flashClass("incomingNodeHighlight", 1500);
            incomers.edges().flashClass("incomingEdgeHighlight", 1500);
            outgoers.nodes().flashClass("outgoingNodeHighlight", 1500);
            outgoers.edges().flashClass("outgoingEdgeHighlight", 1500);
          }
        },
      },
      {
        label: "Un/Lock Nodes",
        items: [
          {
            label: "Unlock selected",
            icon: "pi pi-fw pi-lock-open",
            command: () => {
              if (boardRef) changeLockState(boardRef, false, updateManyNodes);
            },
          },
          {
            label: "Lock selected",
            icon: "pi pi-fw pi-lock",
            command: () => {
              if (boardRef) changeLockState(boardRef, true, updateManyNodes);
            },
          },
        ],
      },
      { separator: true },
      { label: "Template From Node" },
      {
        label: "Delete Selected Nodes",
        command: () => {
          if (!boardRef || !nodes || !edges) return;
          const selected = boardRef.elements(":selected");
          if (selected.length === 0) {
            toaster("warning", "No elements are selected.");
          } else {
            if (nodes.length) deleteManyNodes.mutate(nodes.map((node) => node.id()));
            if (edges.length) deleteManyEdges.mutate(edges.map((edge) => edge.id()));
          }
        },
      },
    ];
  if (type === "edges")
    return [
      {
        label: "Highlight Connected Nodes",
        command: () => {
          if (edges) {
            edges.sources().flashClass("incomingNodeHighlight", 2000);
            edges.targets().flashClass("outgoingNodeHighlight", 2000);
          }
        },
      },
      {
        label: "Delete Selected Edges",
        command: () => {
          if (edges) deleteManyEdges.mutate(edges.map((edge: any) => edge.id()));
        },
      },
    ];
  return [];
}
