import { EdgeCollection, EdgeDefinition, NodeCollection, NodeDefinition } from "cytoscape";
import { useAtom } from "jotai";
import { ProgressSpinner } from "primereact/progressspinner";
import { useCallback, useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

import ContextMenu from "../../components/ContextMenu/ContextMenu";
import BoardQuickBar from "../../components/QuickBar/QuickBar";
import { useCreateSubItem, useDeleteManySubItems, useUpdateManySubItems, useUpdateSubItem } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { BoardType, EdgeType, NodeType } from "../../types/boardTypes";
import { baseURLS, getURLS } from "../../types/CRUDenums";
import { BoardEdgeHandlesAtom, BoardReferenceAtom, BoardStateAtom, DrawerAtom } from "../../utils/Atoms/atoms";
import { changeLockState, edgehandlesSettings } from "../../utils/boardUtils";
import { cytoscapeGridOptions, cytoscapeStylesheet, DefaultEdge, DefaultNode } from "../../utils/DefaultValues/BoardDefaults";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { toaster } from "../../utils/toast";

type Props = {
  isReadOnly?: boolean;
};
type BoardContextType = null | "board" | "nodes" | "edges";

export default function BoardView({ isReadOnly }: Props) {
  const cm = useRef() as any;
  const { project_id, item_id, subitem_id } = useParams();
  const [, setDrawer] = useAtom(DrawerAtom);
  const [boardRef, setBoardRef] = useAtom(BoardReferenceAtom);

  const [edgeHandlesRef, setEdgeHandlesRef] = useAtom(BoardEdgeHandlesAtom);

  const [boardState] = useAtom(BoardStateAtom);
  const [boardContext, setBoardContext] = useState<{
    x: null | number;
    y: null | number;
    type: BoardContextType;
    nodes: NodeCollection | null;
    edges: EdgeCollection | null;
  }>({
    x: null,
    y: null,
    type: null,
    nodes: null,
    edges: null,
  });
  const [elements, setElements] = useState<(NodeDefinition | EdgeDefinition)[]>([]);
  const { data: board, isLoading } = useGetItem(item_id as string, "boards") as {
    data: BoardType;
    isLoading: boolean;
  };
  const createNodeMutation = useCreateSubItem(item_id as string, "nodes", "boards");
  const updateNodeMutation = useUpdateSubItem(item_id as string, "nodes", "boards");
  const updateManyNodes = useUpdateManySubItems(item_id as string, "nodes");
  const deleteManyNodes = useDeleteManySubItems(item_id as string, "nodes");

  const createEdgeMutation = useCreateSubItem(item_id as string, "edges", "boards");
  const deleteManyEdges = useDeleteManySubItems(item_id as string, "edges");
  const items = (type: BoardContextType) => {
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
  };
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
              backgroundImage: node.image ? `${baseURLS.baseServer}${getURLS.getSingleImage}${project_id}/${node?.image}` : [],
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
    (source: string, target: string, color: string) => {
      createEdgeMutation.mutate({
        ...DefaultEdge,
        id: uuid(),
        parent: item_id as string,
        source_id: source,
        target_id: target,
        lineColor: color,
        targetArrowColor: color,
      });
    },
    [item_id],
  );
  // Board Events
  useEffect(() => {
    if (boardRef && !isReadOnly) {
      // Right click
      boardRef.on("cxttap", function (evt: any) {
        // If the target is the background of the canvas
        if (evt.target === boardRef) {
          cm.current.show(evt.originalEvent);
          setBoardContext({
            ...evt.position,
            type: "board",
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
            setBoardContext({
              ...evt.position,
              nodes: group,
              type: "nodes",
            });
          } else if (group === "edges") {
            cm.current.show(evt.originalEvent);
            setBoardContext({
              ...evt.position,
              edges: group,
              type: "edges",
            });
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

      // Double Click
      boardRef.on("dbltap", "node", function (evt: any) {
        const target = evt.target._private;
        const { backgroundImage, classes, document, locked, parent, zIndexCompare, ...rest } = target.data;
        setDrawer({ ...DefaultDrawer, data: rest, position: "right", show: true, type: "nodes", drawerSize: "sm" });
      });
      boardRef.on("dbltap", "edge", function (evt: any) {
        const targetEdge = evt.target._private;
        const { classes, parent, zIndexCompare, source, target, ...rest } = targetEdge.data;
        setDrawer({ ...DefaultDrawer, data: rest, position: "right", show: true, type: "edges", drawerSize: "sm" });
      });
    }
    return () => {
      if (!isReadOnly && boardRef) {
        boardRef.removeListener("click mousedown cxttap dbltap free ehcomplete");
      }
    };
  }, [boardRef, item_id]);

  useEffect(() => {
    setTimeout(() => {
      // If there is a node id in the URL navigate to that node
      if (subitem_id && boardRef) {
        const node = boardRef.getElementById(subitem_id);

        if (node)
          boardRef?.animate({
            center: {
              eles: node,
            },
          });
      }
    }, 250);
  }, [subitem_id, boardRef]);
  if (isLoading) return <ProgressSpinner />;
  return (
    <div className="h-full w-full">
      <ContextMenu cm={cm} items={items(boardContext.type)} />

      <CytoscapeComponent
        className="h-full w-full"
        cy={(cy) => {
          if (cy) {
            // @ts-ignore
            cy.gridGuide({
              ...cytoscapeGridOptions,
              snapToGridDuringDrag: boardState.grid,
              drawGrid: boardState.grid,
            });
          }
          setBoardRef(cy);
          if (!edgeHandlesRef && boardRef) setEdgeHandlesRef(boardRef.edgehandles(edgehandlesSettings));
        }}
        elements={elements}
        // @ts-ignore
        stylesheet={cytoscapeStylesheet}
      />
      <BoardQuickBar />
    </div>
  );
}
