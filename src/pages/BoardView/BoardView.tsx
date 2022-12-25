import { EdgeDefinition, EventObject, NodeDefinition } from "cytoscape";
import { useAtom } from "jotai";
import { ProgressSpinner } from "primereact/progressspinner";
import { useCallback, useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

import ContextMenu from "../../components/ContextMenu/ContextMenu";
import BoardQuickBar from "../../components/QuickBar/QuickBar";
import { useCreateSubItem } from "../../CRUD/ItemsCRUD";
import { useBatchUpdateNodePositions } from "../../hooks/useBatchDragEvents";
import { useGetItem } from "../../hooks/useGetItem";
import { BoardContext, BoardType, EdgeType, NodeType } from "../../types/boardTypes";
import { baseURLS, getURLS } from "../../types/CRUDenums";
import { BoardEdgeHandlesAtom, BoardReferenceAtom, BoardStateAtom, DrawerAtom } from "../../utils/Atoms/atoms";
import { edgehandlesSettings } from "../../utils/boardUtils";
import { useBoardContextMenuItems } from "../../utils/contextMenus";
import { cytoscapeGridOptions, cytoscapeStylesheet, DefaultEdge } from "../../utils/DefaultValues/BoardDefaults";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { toaster } from "../../utils/toast";

type Props = {
  isReadOnly?: boolean;
};

export default function BoardView({ isReadOnly }: Props) {
  const cm = useRef() as any;
  const { project_id, item_id, subitem_id } = useParams();
  const [, setDrawer] = useAtom(DrawerAtom);
  const [boardRef, setBoardRef] = useAtom(BoardReferenceAtom);
  const { addOrUpdateNode } = useBatchUpdateNodePositions(item_id as string);
  const [edgeHandlesRef, setEdgeHandlesRef] = useAtom(BoardEdgeHandlesAtom);

  const [boardState] = useAtom(BoardStateAtom);
  const [boardContext, setBoardContext] = useState<BoardContext>({
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
  const contextItems = useBoardContextMenuItems({ type: boardContext.type, item_id: item_id as string, board, boardContext });
  const createEdgeMutation = useCreateSubItem(item_id as string, "edges", "boards");

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
      boardRef.on("free", "node", function (evt: EventObject) {
        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();
        const target = evt.target._private;
        boardRef.elements(":selected").select();
        evt.target.select();
        // Grid extenstion messes with the "grab events"
        // "Freeon" event triggers on double clicking
        // This is a safeguard to prevent the node position from being changed on anything EXCEPT dragging
        addOrUpdateNode({ id: target.data.id, ...target.position });
      });

      // Double Click
      boardRef.on("dbltap", "node", function (evt: any) {
        const target = evt.target._private;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { backgroundImage, classes, document, locked, parent, zIndexCompare, ...rest } = target.data;
        setDrawer({ ...DefaultDrawer, data: rest, position: "right", show: true, type: "nodes", drawerSize: "sm" });
      });
      boardRef.on("dbltap", "edge", function (evt: any) {
        const targetEdge = evt.target._private;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { classes, parent, zIndexCompare, source, target, ...rest } = targetEdge.data;
        setDrawer({ ...DefaultDrawer, data: rest, position: "right", show: true, type: "edges", drawerSize: "sm" });
      });
    }
    return () => {
      if (boardRef) {
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
      <ContextMenu cm={cm} items={contextItems} />

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
