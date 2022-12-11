import { EdgeDefinition, EventHandler, NodeDefinition } from "cytoscape";
import { useAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";

import ContextMenu from "../../components/ContextMenu/ContextMenu";
import BoardQuickBar from "../../components/QuickBar/QuickBar";
import { useCreateNodeEdge, useDeleteManySubItems, useUpdateManySubItems, useUpdateNodeEdge } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/getItemHook";
import { BoardType, EdgeType, NodeType } from "../../types/boardTypes";
import { BoardReferenceAtom, BoardStateAtom, DrawerAtom } from "../../utils/Atoms/atoms";
import { changeLockState, edgehandlesSettings } from "../../utils/boardUtils";
import { cytoscapeStylesheet, DefaultEdge, DefaultNode } from "../../utils/DefaultValues/BoardDefaults";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { toaster } from "../../utils/toast";

type Props = {
  isReadOnly?: boolean;
};

export default function BoardView({ isReadOnly }: Props) {
  const cm = useRef() as any;
  const { project_id, item_id } = useParams();
  const [, setDrawer] = useAtom(DrawerAtom);
  const [boardRef, setBoardRef] = useAtom(BoardReferenceAtom);
  const [boardState, setBoardState] = useAtom(BoardStateAtom);
  const [boardContext, setBoardContext] = useState<{ x: null | number; y: null | number; type: "node" | "edge" }>({
    x: null,
    y: null,
    type: "node",
  });
  const [elements, setElements] = useState<(NodeDefinition | EdgeDefinition)[]>([]);
  const board = useGetItem(project_id as string, item_id as string, "boards") as BoardType;
  const createNodeMutation = useCreateNodeEdge(project_id as string, "nodes");
  const updateNodeMutation = useUpdateNodeEdge(project_id as string, item_id as string, "nodes");
  const updateManyNodes = useUpdateManySubItems(project_id as string, "nodes");
  const deleteManyNodes = useDeleteManySubItems(project_id as string, item_id as string, "nodes");
  const createEdgeMutation = useCreateNodeEdge(project_id as string, "edges");
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
              classes: `boardNode ${isReadOnly && "publicBoardNode"}`,
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
            classes: `boardEdge ${isReadOnly && "publicBoardEdge"}`,
            label: edge.label || "",
          },
        }));
      }
      setElements([...temp_nodes, ...temp_edges]);
    }
  }, [board, item_id]);
  const makeEdgeCallback = useCallback(
    (source: string, target: string, color?: string) => {
      createEdgeMutation.mutate({
        ...DefaultEdge,
        id: v4(),
        parent: item_id as string,
        source_id: source,
        target_id: target,
      });
    },
    [item_id],
  );
  // Board Events
  useEffect(() => {
    if (boardRef && !isReadOnly) {
      setBoardState({ ...boardState, edgeHandles: { drawMode: false, ref: boardRef.edgehandles(edgehandlesSettings) } });
      // Right click
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
      // Creating edges
      // @ts-ignore
      boardRef.on("ehcomplete", function (event: any, sourceNode: any, targetNode: any, addedEdge: any) {
        const sourceData = sourceNode._private.data;
        const targetData = targetNode._private.data;

        // Check due to weird edgehandles behavior when toggling drawmode
        // When drawmode is turned on and then off and then back on
        // It can add an edges to a node that doesn't exist
        try {
          boardRef.remove(addedEdge);
        } catch (error) {
          toaster("warning", "Cytoedge couldn't be removed, there was an error.");
        }
        makeEdgeCallback(sourceData.id, targetData.id, board?.defaultEdgeColor);
      });
      // Moving nodes
      boardRef.on("free", "node", function (evt: any) {
        const target = evt.target._private;
        boardRef.elements(":selected").select();
        evt.target.select();

        // Grid extenstion messes with the "grab events"
        // "Freeon" event triggers on double clicking
        // This is a safeguard to prevent the node position from being changed on anything EXCEPT dragging
        if (target.position.x !== target?.data.x || target.position.y !== target.data?.y)
          updateNodeMutation.mutate({
            id: target.data.id,
            x: target.position.x,
            y: target.position.y,
          });
      });

      boardRef.on("dbltap", "node", function (evt: any) {
        const target = evt.target._private;
        const { backgroundImage, board_id, classes, document, locked, parent, user_id, x, y, zIndexCompare, ...rest } =
          target.data;
        setDrawer({ ...DefaultDrawer, data: rest, position: "right", show: true, type: "nodes", drawerSize: "sm" });
      });
    }
  }, [boardRef]);

  return (
    <div className="h-full w-full">
      <ContextMenu cm={cm} items={items} />
      <CytoscapeComponent
        className="h-full w-full"
        cy={(cy) => {
          setBoardRef(cy);
        }}
        elements={elements}
        // @ts-ignore
        stylesheet={cytoscapeStylesheet}
      />
      <BoardQuickBar />
    </div>
  );
}
