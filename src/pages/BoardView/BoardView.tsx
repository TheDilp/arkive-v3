import { Collection, EventObject } from "cytoscape";
import { useAtom } from "jotai";
import { ProgressSpinner } from "primereact/progressspinner";
import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useParams } from "react-router-dom";

import ContextMenu from "../../components/ContextMenu/ContextMenu";
import BoardQuickBar from "../../components/QuickBar/QuickBar";
import { useCreateSubItem } from "../../CRUD/ItemsCRUD";
import { useBatchUpdateNodePositions } from "../../hooks/useBatchDragEvents";
import { useGetItem } from "../../hooks/useGetItem";
import { BoardDragItemType } from "../../types/generalTypes";
import { BoardContext, BoardType, EdgeType, NodeType } from "../../types/ItemTypes/boardTypes";
import { BoardReferenceAtom, BoardStateAtom, DrawerAtom, EdgesAtom, NodesAtom } from "../../utils/Atoms/atoms";
import { edgehandlesSettings, mapEdges, mapNodes, toModelPosition } from "../../utils/boardUtils";
import { useBoardContextMenuItems } from "../../utils/contextMenus";
import { cytoscapeGridOptions, getCytoscapeStylesheet } from "../../utils/DefaultValues/BoardDefaults";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { toaster } from "../../utils/toast";

type Props = {
  isReadOnly?: boolean;
};

export default function BoardView({ isReadOnly }: Props) {
  const cm = useRef() as MutableRefObject<any>;
  const cyRef = useRef() as any;
  const ehRef = useRef(undefined) as any;
  const firstRender = useRef(true) as MutableRefObject<boolean>;
  const { item_id, subitem_id } = useParams();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const [boardState, setBoardState] = useAtom(BoardStateAtom);
  const [, setBoardRef] = useAtom(BoardReferenceAtom);
  const [boardContext, setBoardContext] = useState<BoardContext>({
    x: null,
    y: null,
    type: null,
    nodes: null,
    edges: null,
  });

  const [nodes, setNodes] = useAtom(NodesAtom);
  const [edges, setEdges] = useAtom(EdgesAtom);

  const { data: board, isLoading } = useGetItem<BoardType>(item_id as string, "boards", {}, isReadOnly);
  const { addOrUpdateNode } = useBatchUpdateNodePositions(item_id as string);

  const styleSheet = useMemo(
    () => getCytoscapeStylesheet(boardState.curveStyle),

    [boardState.curveStyle],
  );

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
      cyRef?.current?._cy?.remove(".eh-ghost-edge");
      createEdgeMutation.mutate({
        id: crypto.randomUUID(),
        parentId: item_id as string,
        source_id: source,
        target_id: target,
        lineColor: color,
        curveStyle: boardState.curveStyle,
        targetArrowColor: color,
      });
    },
    [boardState.curveStyle],
  );

  useEffect(() => {
    if (board?.nodes && board.nodes.length > 0 && !nodes.length) {
      setNodes(mapNodes(board.nodes, isReadOnly));
    }
    if (board?.edges && board.edges.length > 0 && !edges.length) {
      setEdges(mapEdges(board.edges, isReadOnly));
    }
  }, [board]);

  useEffect(() => {
    if (!cyRef || !ehRef) return () => {};
    if (firstRender && firstRender.current) {
      firstRender.current = false;
    }
    // ehRef.current = undefined;

    return () => {
      firstRender.current = true;
      if (ehRef?.current) {
        ehRef.current.destroy();
        ehRef.current = undefined;
      }
      if (cyRef?.current?._cy) {
        cyRef?.current?._cy.removeListener("click mousedown cxttap dbltap free");
        setBoardState((prev) => ({ ...prev, drawMode: false }));
      }
      setNodes([]);
      setEdges([]);
    };
  }, [item_id]);

  // Board Events
  useEffect(() => {
    if (cyRef?.current?._cy && !isReadOnly) {
      // Right click
      cyRef?.current?._cy.on("cxttap", function (evt: any) {
        // If the target is the background of the canvas
        if (evt.target === cyRef?.current?._cy) {
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
          if (!cyRef?.current?._cy.elements(":selected").contains(evt.target)) {
            cyRef?.current?._cy.elements(":selected").unselect();
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

      // Moving nodes
      cyRef?.current?._cy.on("free", "node", function (evt: EventObject) {
        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();
        const target = evt.target._private;
        cyRef?.current?._cy.elements(":selected").select();
        evt.target.select();
        // Grid extenstion messes with the "grab events"
        // "Freeon" event triggers on double clicking
        // This is a safeguard to prevent the node position from being changed on anything EXCEPT dragging

        if (target.position.x !== target?.data.x || target.position.y !== target.data?.y) {
          setNodes((prev) => {
            const idx = prev.findIndex((n) => n.data.id === target.data.id);

            if (idx !== -1) {
              const newNodes = [...prev];
              const foundNode = newNodes[idx];
              if (foundNode.data.x !== target.position.x || foundNode.data.y !== target.position.y) {
                addOrUpdateNode({ id: target.data.id, ...target.position });
                newNodes[idx] = { ...newNodes[idx], data: { ...foundNode.data, ...target.position } };
                return newNodes;
              }
              return prev;
            }
            return prev;
          });
        }
      });
      // Double Click
      cyRef?.current?._cy.on("dbltap", "node", function (evt: any) {
        const target = evt.target._private;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { backgroundImage, classes, document, locked, parent, zIndexCompare, ...rest } = target.data;
        setDrawer({ ...DefaultDrawer, data: rest, position: "right", show: true, type: "nodes", drawerSize: "sm" });
      });
      cyRef?.current?._cy.on("dbltap", "edge", function (evt: any) {
        const targetEdge = evt.target._private;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { classes, parent, zIndexCompare, source, target, ...rest } = targetEdge.data;
        setDrawer({ ...DefaultDrawer, data: rest, position: "right", show: true, type: "edges", drawerSize: "sm" });
      });
    }
  }, [cyRef?.current?._cy, item_id]);

  useEffect(() => {
    // Creating edges
    // @ts-ignore
    cyRef?.current?._cy.on("ehcomplete", function (_, sourceNode: any, targetNode: any, addedEdge: any) {
      const sourceData = sourceNode._private.data;
      const targetData = targetNode._private.data;

      // Check due to weird edgehandles behavior when toggling drawmode
      // When drawmode is turned on and then off and then back on
      // It can add an edges to a node that doesn't exist
      try {
        cyRef?.current?._cy.remove(addedEdge);
      } catch (error) {
        toaster("warning", "Cytoedge couldn't be removed, there was an error.");
      }
      makeEdgeCallback(sourceData.id, targetData.id, board?.defaultEdgeColor);
    });

    return () => {
      if (cyRef?.current?._cy) {
        cyRef?.current?._cy.removeListener("ehcomplete");
      }
    };
  }, [cyRef?.current?._cy, item_id, boardState.curveStyle]);

  useEffect(() => {
    // Creating edges
    // @ts-ignore
    cyRef?.current?._cy.on("click", function (evt: any) {
      // If the target is the background of the canvas
      if (evt.target === cyRef?.current?._cy && boardState.addNodes) {
        const { x, y } = evt.position;
        createNodeMutation.mutate({
          x,
          y,
          parentId: item_id,
          type: board?.defaultNodeShape,
          backgroundColor: board?.defaultNodeColor,
          id: crypto.randomUUID(),
        });
      }
    });

    return () => {
      if (cyRef?.current?._cy) {
        cyRef?.current?._cy.removeListener("click");
      }
    };
  }, [cyRef?.current?._cy, item_id, boardState.addNodes]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // If there is a node id in the URL navigate to that node
      if (subitem_id && cyRef?.current?._cy) {
        const node = cyRef?.current?._cy.getElementById(subitem_id);

        if (node)
          cyRef?.current?._cy?.animate({
            center: {
              eles: node,
            },
          });
      } else if (!subitem_id && cyRef?.current?._cy) {
        cyRef?.current?._cy?.animate({
          center: {
            eles: cyRef?.current?._cy?.nodes(),
          },
        });
      }
    }, 250);
    return () => {
      clearTimeout(timeout);
    };
  }, [subitem_id, cyRef?.current?._cy]);
  useEffect(() => {
    if (cyRef?.current?._cy) {
      if (ehRef?.current) {
        if (!boardState.drawMode) {
          ehRef?.current.disable();
          ehRef?.current.disableDrawMode();
          cyRef?.current?._cy.autoungrabify(false);
          cyRef?.current?._cy.autounselectify(false);
          cyRef?.current?._cy.autolock(false);
          cyRef?.current?._cy.zoomingEnabled(true);
          cyRef?.current?._cy.userZoomingEnabled(true);
          cyRef?.current?._cy.panningEnabled(true);
        } else {
          ehRef?.current.enable();
          ehRef?.current.enableDrawMode();
        }
      } else {
        ehRef.current = cyRef?.current?._cy.edgehandles(edgehandlesSettings);
      }
    }
  }, [boardState.drawMode, cyRef?.current?._cy, ehRef?.current]);
  useEffect(() => {
    if (cyRef?.current?._cy) {
      cyRef.current._cy.gridGuide({
        ...cytoscapeGridOptions,
        snapToGridDuringDrag: boardState.grid,
        drawGrid: boardState.grid,
      });
    }
  }, [boardState.grid, cyRef?.current?._cy]);

  useEffect(() => {
    if (cyRef?.current?._cy) {
      if (drawer.type === "edges" || drawer.type === "nodes") {
        const selectedElements: Collection = cyRef.current._cy.elements(".selected");
        if (selectedElements && selectedElements.length > 0) {
          const t = selectedElements.map((el) => `#${el.id()}`).join(", ");
          cyRef?.current?._cy.$(t).removeClass("selected");
        }

        const singleEl = cyRef.current._cy.getElementById(drawer?.data?.id);
        if (singleEl) singleEl.addClass("selected");
      }
    }
    if (drawer.type === null) {
      if (cyRef?.current?._cy) {
        const selectedElements: Collection = cyRef.current._cy.elements(".selected");
        if (selectedElements && selectedElements.length > 0) {
          const t = selectedElements.map((el) => `#${el.id()}`).join(", ");
          cyRef?.current?._cy.$(t).removeClass("selected");
        }
      }
    }
    return () => {};
  }, [drawer]);

  if (isLoading) return <ProgressSpinner />;
  return (
    <div
      className="relative flex h-full w-full justify-center"
      onDrop={(e) => {
        const stringData = e.dataTransfer.getData("item_id");
        if (!stringData) return;
        const data: BoardDragItemType = JSON.parse(e.dataTransfer.getData("item_id"));
        if (!data || !cyRef?.current?._cy) return;
        const { image } = data;
        const { top, left } = e.currentTarget.getBoundingClientRect();
        const { x, y } = toModelPosition(cyRef?.current?._cy, {
          x: e.clientX - left,
          y: e.clientY - top,
        });

        if (data.type === "documents") {
          const { id: doc_id, title: label } = data;
          createNodeMutation.mutate({
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
        ref={cyRef}
        className="h-[94%] w-full"
        cy={(cy) => {
          setBoardRef(cy);
        }}
        elements={[...nodes, ...edges]}
        // @ts-ignore
        stylesheet={styleSheet}
      />
      {isReadOnly ? null : <BoardQuickBar />}
    </div>
  );
}
