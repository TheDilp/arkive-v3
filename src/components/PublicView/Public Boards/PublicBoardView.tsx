import { useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useParams } from "react-router-dom";
import {
  BoardProps,
  CytoscapeEdgeProps,
  CytoscapeNodeProps
} from "../../../custom-types";
import {
  changeLayout,
  cytoscapeGridOptions,
  cytoscapeStylesheet,
  edgehandlesSettings
} from "../../../utils/utils";
export default function PublicBoardView({ board }: { board: BoardProps }) {
  const { board_id } = useParams();
  const [elements, setElements] = useState<
    (CytoscapeNodeProps | CytoscapeEdgeProps)[]
  >([]);
  const [layout, setLayout] = useState<string | null>();
  const cyRef = useRef() as any;
  const ehRef = useRef() as any;
  const grRef = useRef() as any;
  const firstRender = useRef(true) as any;

  useEffect(() => {
    if (board) {
      let temp_nodes: CytoscapeNodeProps[] = [];
      let temp_edges: CytoscapeEdgeProps[] = [];
      if (board.nodes.length > 0) {
        temp_nodes = board.nodes.map((node) => ({
          data: {
            id: node.id,
            classes: "boardNode",
            label: node.label || "",
            type: node.type,
            width: node.width,
            height: node.height,
            fontSize: node.fontSize,
            textHAlign: node.textHAlign,
            textVAlign: node.textVAlign,
            customImage: node.customImage,
            x: node.x,
            y: node.y,
            backgroundColor: node.backgroundColor,
            backgroundOpacity: node.backgroundOpacity,
            zIndex: node.zIndex,
            zIndexCompare: node.zIndex === 0 ? "manual" : "auto",
            // Custom image has priority, if not set use document image, if neither - empty array
            // Empty string ("") causes issues with cytoscape, so an empty array must be used
            backgroundImage: node.customImage?.link
              ? `https://oqzsfqonlctjkurrmwkj.supabase.co/storage/v1/object/public/images/${node.customImage.link.replaceAll(
                  " ",
                  "%20"
                )}`
              : node.document?.image
              ? `https://oqzsfqonlctjkurrmwkj.supabase.co/storage/v1/object/public/images/${node.document.image.link?.replaceAll(
                  " ",
                  "%20"
                )}`
              : [],
          },
          scratch: {
            doc_id: node.document?.id,
          },
          position: { x: node.x, y: node.y },
        }));
      }
      if (board.edges.length > 0) {
        temp_edges = board.edges.map((edge) => ({
          data: {
            id: edge.id,
            classes: "boardEdge",
            label: edge.label || "",
            source: edge.source,
            target: edge.target,
            curveStyle: edge.curveStyle,
            lineStyle: edge.lineStyle,
            lineColor: edge.lineColor,
            controlPointDistances: edge.controlPointDistances,
            controlPointWeights: edge.controlPointWeights,
            taxiDirection: edge.taxiDirection,
            taxiTurn: edge.taxiTurn,
            targetArrowShape: edge.targetArrowShape,
            zIndex: edge.zIndex,
          },
        }));
      }
      const elements = [...temp_nodes, ...temp_edges];
      setElements(elements);
    }
  }, [board]);

  useEffect(() => {
    if (cyRef.current) {
      //   cyRef.current.on("click", "node", function (evt: any) {
      //     const scratch = evt.target._private.scratch;
      //     if (scratch?.doc_id && evt.originalEvent.shiftKey) {
      //       navigate(`../../wiki/${scratch?.doc_id}`);
      //     }
      //   });
    }
  }, [cyRef, board_id]);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    }
    // Reset when changing board_id
    ehRef.current = null;
    grRef.current = null;

    if (board_id && cyRef.current) {
      setTimeout(() => {
        cyRef.current.zoom(1);
        cyRef.current.center();
      }, 200);
    }

    return () => {
      //CRITICAL: Do not use removeAllListeners as that removes the grid listeners as well and breaks the grid
      cyRef.current.removeListener("click cxttap dbltap free");
    };
  }, [board_id, cyRef.current]);
  useEffect(() => {
    if (cyRef && board?.layout) {
      // Timeout necessary to wait for cytoscape to render and then apply layout
      setTimeout(() => {
        changeLayout(board.layout, cyRef);
        setLayout(board.layout);
      }, 1);
    }
  }, [board?.layout, cyRef]);
  useEffect(() => {
    grRef.current = null;
    grRef.current = cyRef.current.gridGuide({
      ...cytoscapeGridOptions,
      snapToGridDuringDrag: true,
    });
  }, []);

  return (
    <div className="w-full h-full">
      <h1 className="text-white absolute z-5 w-full text-center surface-50 Merriweather my-0">
        {board?.title}
      </h1>
      <CytoscapeComponent
        elements={elements}
        className="Lato"
        wheelSensitivity={0.1}
        minZoom={0.1}
        maxZoom={10}
        style={{ width: "100%", height: "100%" }}
        cy={(cy: any) => {
          if (!cyRef.current) {
            cyRef.current = cy;
          }
          if (!ehRef.current) {
            cy.center();
            cy.autoungrabify(true);
            cy.autolock(true);
            cy.autounselectify(true);
            ehRef.current = cyRef.current.edgehandles(edgehandlesSettings);
            grRef.current = cyRef.current.gridGuide({
              ...cytoscapeGridOptions,
              snapToGridDuringDrag: true,
            });
          }
        }}
        stylesheet={cytoscapeStylesheet}
      />
    </div>
  );
}
