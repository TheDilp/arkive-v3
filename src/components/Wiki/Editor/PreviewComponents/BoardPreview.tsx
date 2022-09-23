import { Resizable } from "re-resizable";
import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  BoardEdgeProps,
  BoardNodeProps,
  BoardProps,
  CytoscapeEdgeProps,
  CytoscapeNodeProps,
} from "../../../../types/BoardTypes";
import { MapPreviewAttributes } from "../CustomExtensions/CustomPreviews/MapPreviewExtension";
import CytoscapeComponent from "react-cytoscapejs";
import { supabaseStorageImagesLink } from "../../../../utils/utils";
import { cytoscapeStylesheet } from "../../../../utils/boardUtils";

const Cyto = memo(CytoscapeComponent, (prev, next) => {
  if (prev.elements.length === 0) return false;

  return true;
});

export default function BoardPreview({
  id,
  width,
  height,
  x,
  y,
  zoom,
  updateAttributes,
}: MapPreviewAttributes) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const boards = queryClient.getQueryData<BoardProps[]>(`${project_id}-boards`);
  const [boardData, setBoardData] = useState<BoardProps | null>(null);
  const [dims, setDims] = useState({ width, height });
  const [elements, setElements] = useState<
    (CytoscapeNodeProps | CytoscapeEdgeProps)[]
  >([]);

  useLayoutEffect(() => {
    if (boards && id) {
      let board = boards.find((board) => board.id === id);
      if (board) {
        setBoardData(board);
      }
    }
  }, [id]);

  useEffect(() => {
    if (boardData) {
      let temp_nodes: CytoscapeNodeProps[] = [];
      let temp_edges: CytoscapeEdgeProps[] = [];
      if (boardData.nodes.length > 0) {
        temp_nodes = boardData.nodes.map((node: BoardNodeProps) => ({
          data: {
            ...node,
            classes: "boardNode publicBoardNode",
            label: node.label || "",
            zIndexCompare: node.zIndex === 0 ? "manual" : "auto",
            // Custom image has priority, if not set use document image, if neither - empty array
            // Empty string ("") causes issues with cytoscape, so an empty array must be used
            backgroundImage: node.customImage?.link
              ? `${supabaseStorageImagesLink}${node.customImage.link.replaceAll(
                  " ",
                  "%20"
                )}`
              : node.document?.image?.link
              ? `${supabaseStorageImagesLink}${node.document.image.link?.replaceAll(
                  " ",
                  "%20"
                )}`
              : [],
          },
          scratch: {
            doc_id: node.document?.id,
          },
          locked: node.locked,
          position: { x: node.x, y: node.y },
        }));
      }
      if (boardData.edges.length > 0) {
        temp_edges = boardData.edges.map((edge: BoardEdgeProps) => ({
          data: {
            ...edge,
            classes: "boardEdge publicBoardEdge",
            label: edge.label || "",
          },
        }));
      }
      const elements = [...temp_nodes, ...temp_edges];
      setElements(elements);
    }
  }, [boardData]);

  const RerendCyto = useCallback(
    () => (
      <Cyto
        elements={elements}
        className="Lato absolute bg-gray-800 border-rounded-lg"
        style={{
          width: dims.width + "px",
          height: dims.height + "px",
        }}
        wheelSensitivity={0.1}
        minZoom={0.1}
        maxZoom={10}
        cy={(cy: any) => {
          cy.on("click", "node", function (evt: any) {
            const scratch = evt.target._private.scratch;
            if (scratch?.doc_id && evt.originalEvent.altKey) {
              navigate(`../doc/${scratch?.doc_id}`);
            } else {
              evt.target.select();
            }
          });
          cy.center();
          cy.autoungrabify(true);
          cy.autolock(true);
          cy.autounselectify(true);
          cy.viewport({
            zoom,
            pan: {
              x,
              y,
            },
          });
          cy.on("mouseup", function (e: any) {
            try {
              if (updateAttributes)
                updateAttributes({ ...e.target.pan(), zoom: e.target.zoom() });
            } catch (error) {}
          });
        }}
        stylesheet={cytoscapeStylesheet}
      />
    ),
    [dims, elements]
  );

  if (!boardData) return null;
  return (
    <Resizable
      className="bg-gray-800 overflow-hidden"
      bounds="parent"
      minWidth={300}
      minHeight={480}
      size={dims}
      onResizeStop={(e, dir, ref, delta) => {
        // Delta provides DELTAS (differences, changes) for the resizing, not the total and absolute dimensions
        // We update the old size with the differences provided
        setDims({
          width: dims.width + delta.width,
          height: dims.height + delta.height,
        });

        if (updateAttributes)
          updateAttributes({
            height: dims.height + delta.height,
            width: dims.width + delta.width,
          });
      }}
    >
      <RerendCyto />
    </Resizable>
  );
}
