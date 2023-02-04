import { EdgeDefinition, EventObject, NodeDefinition } from "cytoscape";
import { useAtom } from "jotai";
import { ProgressSpinner } from "primereact/progressspinner";
import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useParams } from "react-router-dom";

import ContextMenu from "../../components/ContextMenu/ContextMenu";
import BoardQuickBar from "../../components/QuickBar/QuickBar";
import { useCreateSubItem } from "../../CRUD/ItemsCRUD";
import { useBatchUpdateNodePositions } from "../../hooks/useBatchDragEvents";
import { useGetItem } from "../../hooks/useGetItem";
import { DragItem } from "../../types/generalTypes";
import { BoardContext, BoardType, EdgeType, NodeType } from "../../types/ItemTypes/boardTypes";
import { BoardStateAtom, DrawerAtom } from "../../utils/Atoms/atoms";
import { edgehandlesSettings, mapEdges, mapNodes, toModelPosition } from "../../utils/boardUtils";
import { useBoardContextMenuItems } from "../../utils/contextMenus";
import { cytoscapeGridOptions, cytoscapeStylesheet, DefaultEdge, DefaultNode } from "../../utils/DefaultValues/BoardDefaults";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { toaster } from "../../utils/toast";

type Props = {
  isReadOnly?: boolean;
};

export default function BoardView({ isReadOnly }: Props) {
  const cm = useRef() as MutableRefObject<any>;
  const cyRef = useRef() as any;
  const ehRef = useRef() as any;
  const firstRender = useRef(true) as MutableRefObject<boolean>;
  const { item_id, subitem_id } = useParams();
  const [, setDrawer] = useAtom(DrawerAtom);
  const { addOrUpdateNode } = useBatchUpdateNodePositions(item_id as string);

  const [boardState] = useAtom(BoardStateAtom);
  const [boardContext, setBoardContext] = useState<BoardContext>({
    x: null,
    y: null,
    type: null,
    nodes: null,
    edges: null,
  });
  const [elements, setElements] = useState<(NodeDefinition | EdgeDefinition)[]>([]);
  const { data: board, isLoading } = useGetItem<BoardType>(item_id as string, "boards");
  const contextItems = useBoardContextMenuItems({
    type: boardContext.type,
    item_id: item_id as string,
    board: board as BoardType,
    boardContext,
  });
  const createNodeMutation = useCreateSubItem<NodeType>(item_id as string, "nodes", "boards");
  const createEdgeMutation = useCreateSubItem<EdgeType>(item_id as string, "edges", "boards");
  const makeEdgeCallback = useCallback(
    (source: string, target: string, color?: string) => {
      createEdgeMutation.mutate({
        ...DefaultEdge,
        id: crypto.randomUUID(),
        parentId: item_id as string,
        source_id: source,
        target_id: target,
        lineColor: color,
        targetArrowColor: color,
      });
    },
    [item_id],
  );

  useEffect(() => {
    let temp_nodes: NodeDefinition[] = [];
    let temp_edges: EdgeDefinition[] = [];
    if (board?.nodes && board.nodes.length > 0) {
      temp_nodes = mapNodes(board.nodes, isReadOnly);
    }
    if (board?.edges && board.edges.length > 0) {
      temp_edges = mapEdges(board.edges, isReadOnly);
    }
    setElements([...temp_nodes, ...temp_edges]);
  }, [board]);

  useEffect(() => {
    if (firstRender && firstRender.current) {
      firstRender.current = false;
    }

    return () => {
      firstRender.current = true;

      if (cyRef?.current) {
        cyRef?.current.removeListener("click mousedown cxttap dbltap free ehcomplete");
        // cyRef?.current.destroy();
      }
    };
  }, [item_id]);

  // Board Events
  useEffect(() => {
    if (cyRef?.current && !isReadOnly) {
      // Right click
      cyRef?.current.on("cxttap", function (evt: any) {
        // If the target is the background of the canvas
        if (evt.target === cyRef?.current) {
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
          if (!cyRef?.current.elements(":selected").contains(evt.target)) {
            cyRef?.current.elements(":selected").unselect();
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
      cyRef?.current.on("ehcomplete", function (_, sourceNode: any, targetNode: any, addedEdge: any) {
        const sourceData = sourceNode._private.data;
        const targetData = targetNode._private.data;

        // Check due to weird edgehandles behavior when toggling drawmode
        // When drawmode is turned on and then off and then back on
        // It can add an edges to a node that doesn't exist
        try {
          cyRef?.current.remove(addedEdge);
        } catch (error) {
          toaster("warning", "Cytoedge couldn't be removed, there was an error.");
        }
        makeEdgeCallback(sourceData.id, targetData.id, board?.defaultEdgeColor);
      });

      // Moving nodes
      cyRef?.current.on("free", "node", function (evt: EventObject) {
        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();
        const target = evt.target._private;
        cyRef?.current.elements(":selected").select();
        evt.target.select();
        // Grid extenstion messes with the "grab events"
        // "Freeon" event triggers on double clicking
        // This is a safeguard to prevent the node position from being changed on anything EXCEPT dragging
        addOrUpdateNode({ id: target.data.id, ...target.position });
      });

      // Double Click
      cyRef?.current.on("dbltap", "node", function (evt: any) {
        const target = evt.target._private;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { backgroundImage, classes, document, locked, parent, zIndexCompare, ...rest } = target.data;
        setDrawer({ ...DefaultDrawer, data: rest, position: "right", show: true, type: "nodes", drawerSize: "sm" });
      });
      cyRef?.current.on("dbltap", "edge", function (evt: any) {
        const targetEdge = evt.target._private;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { classes, parent, zIndexCompare, source, target, ...rest } = targetEdge.data;
        setDrawer({ ...DefaultDrawer, data: rest, position: "right", show: true, type: "edges", drawerSize: "sm" });
      });
    }
  }, [cyRef?.current, item_id]);

  useEffect(() => {
    setTimeout(() => {
      // If there is a node id in the URL navigate to that node
      if (subitem_id && cyRef?.current) {
        const node = cyRef?.current.getElementById(subitem_id);

        if (node)
          cyRef?.current?.animate({
            center: {
              eles: node,
            },
          });
      }
    }, 250);
  }, [subitem_id, cyRef?.current]);

  useEffect(() => {
    if (cyRef?.current) {
      if (!boardState.drawMode) {
        ehRef?.current.disable();
        ehRef?.current.disableDrawMode();
        cyRef?.current.autoungrabify(false);
        cyRef?.current.autounselectify(false);
        cyRef?.current.autolock(false);
        cyRef?.current.zoomingEnabled(true);
        cyRef?.current.userZoomingEnabled(true);
        cyRef?.current.panningEnabled(true);
      } else {
        ehRef?.current.enable();
        ehRef?.current.enableDrawMode();
      }
    }
  }, [boardState.drawMode]);

  if (isLoading) return <ProgressSpinner />;
  return (
    <div
      className="relative flex h-full w-full justify-center"
      onDrop={(e) => {
        const stringData = e.dataTransfer.getData("item_id");
        if (!stringData) return;
        const data: DragItem = JSON.parse(e.dataTransfer.getData("item_id"));
        if (!data || !cyRef?.current) return;
        const { image } = data;
        const { top, left } = e.currentTarget.getBoundingClientRect();
        const { x, y } = toModelPosition(cyRef?.current, {
          x: e.clientX - left,
          y: e.clientY - top,
        });

        if (data.type === "documents") {
          const { id: doc_id, title: label } = data;
          createNodeMutation.mutate({
            ...DefaultNode,
            x,
            y,
            parentId: item_id,
            type: board?.defaultNodeShape,
            backgroundColor: board?.defaultNodeColor,
            id: crypto.randomUUID(),
            label,
            image,
            doc_id,
          });
        } else if (data.type === "images") {
          createNodeMutation.mutate({
            ...DefaultNode,
            x,
            y,
            parentId: item_id,
            type: board?.defaultNodeShape,
            backgroundColor: board?.defaultNodeColor,
            id: crypto.randomUUID(),
            image,
          });
        }
      }}>
      <ContextMenu cm={cm} items={contextItems} />

      <CytoscapeComponent
        className="h-[94%] w-full"
        cy={(cy) => {
          if (cy) {
            // @ts-ignore
            cyRef.current = cy;
            cyRef.current.gridGuide({
              ...cytoscapeGridOptions,
              snapToGridDuringDrag: boardState.grid,
              drawGrid: boardState.grid,
            });
            ehRef.current = cyRef.current.edgehandles(edgehandlesSettings);
          }
        }}
        elements={elements}
        // @ts-ignore
        stylesheet={cytoscapeStylesheet}
      />
      <BoardQuickBar />
    </div>
  );
}
