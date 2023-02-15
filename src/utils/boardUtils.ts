import { UseMutationResult } from "@tanstack/react-query";
import cytoscape, { Core } from "cytoscape";
import { saveAs } from "file-saver";

import { AllSubItemsType } from "../types/generalTypes";
import { EdgeType, NodeType } from "../types/ItemTypes/boardTypes";
import { toaster } from "./toast";

export function changeLockState(
  boardContext: cytoscape.Core,
  locked: boolean,
  updateManyNodesLockState: UseMutationResult<
    Response | null,
    unknown,
    {
      ids: string[];
      data: Partial<AllSubItemsType>;
    },
    {
      old: unknown;
    }
  >,
) {
  const selected = boardContext.nodes(":selected");
  if (locked) {
    selected.lock();
  } else {
    selected.unlock();
  }
  const ids = selected.map((node: any) => node.data().id);
  updateManyNodesLockState.mutate({ ids, data: { locked } });
}

export const edgehandlesSettings = {
  canConnect(sourceNode: any, targetNode: any) {
    return (
      !sourceNode.outgoers().includes(targetNode) && !sourceNode.same(targetNode) && !targetNode.outgoers().includes(sourceNode)
    );
    // whether an edge can be created between source and target
    // e.g. disallow loops
  },
  edgeParams(sourceNode: any, targetNode: any) {
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for edge
    return {
      class: "eh-ghost-edge",
      data: {
        source: sourceNode.id(),
        target: targetNode.id(),
        curveStyle: "straight",
        lineStyle: "solid",
        lineColor: "#1e1e1e",
      },
    };
  },
  hoverDelay: 150, // time spent hovering over a target node before it is considered selected
  snap: false, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
  snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
  snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
  noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
  disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
};
export const BoardFontSizes = [
  10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70,
  72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124, 126,
  128, 130, 132, 134, 136, 138, 140, 142, 144, 146, 148, 150, 152, 154, 156, 158, 160, 162, 164, 166, 168, 170, 172, 174, 176,
  178, 180, 182, 184, 186, 188, 190, 192, 194, 196, 198, 200,
];

export const BoardFontFamilies = [
  {
    label: "Arial",
    value: "Arial",
  },
  {
    label: "Brush Script MT",
    value: "Brush Script MT",
  },
  {
    label: "Courier New",
    value: "Courier New",
  },
  {
    label: "Garamond",
    value: "Garamond",
  },
  {
    label: "Georgia",
    value: "Georgia",
  },
  {
    label: "Helvetica",
    value: "Helvetica",
  },
  {
    label: "Lato",
    value: "Lato",
  },
  {
    label: "Merriweather",
    value: "Merriweather",
  },
  {
    label: "Tahoma",
    value: "Tahoma",
  },
  {
    label: "Times New Roman",
    value: "Times New Roman",
  },
  {
    label: "Trebuchet MS",
    value: "Trebuchet MS",
  },
  {
    label: "Verdana",
    value: "Verdana",
  },
];

export const textHAlignOptions = [
  {
    label: "Left",
    value: "left",
  },
  {
    label: "Center",
    value: "center",
  },
  {
    label: "Right",
    value: "right",
  },
];
export const textVAlignOptions = [
  {
    label: "Top",
    value: "top",
  },
  {
    label: "Center",
    value: "center",
  },
  {
    label: "Bottom",
    value: "bottom",
  },
];

export const boardNodeShapes = [
  {
    label: "Rectangle",
    value: "rectangle",
  },
  {
    label: "Ellipse",
    value: "ellipse",
  },
  {
    label: "Triangle",
    value: "triangle",
  },
  {
    label: "Barrel",
    value: "barrel",
  },
  {
    label: "Rhomboid",
    value: "rhomboid",
  },

  {
    label: "Diamond",
    value: "diamond",
  },
  {
    label: "Pentagon",
    value: "pentagon",
  },
  {
    label: "Hexagon",
    value: "hexagon",
  },
  {
    label: "Heptagon",
    value: "heptagon",
  },
  {
    label: "Octagon",
    value: "octagon",
  },
  {
    label: "Star",
    value: "star",
  },
  {
    label: "Cut Rectangle",
    value: "cut-rectangle",
  },
  {
    label: "Round Triangle",
    value: "round-triangle",
  },
  {
    label: "Round Rectangle",
    value: "round-rectangle",
  },
  {
    label: "Bottom Round Rectangle",
    value: "bottom-round-rectangle",
  },

  {
    label: "Round Diamond",
    value: "round-diamond",
  },
  {
    label: "Round Pentagon",
    value: "round-pentagon",
  },
  {
    label: "Round Hexagon",
    value: "round-hexagon",
  },
  {
    label: "Round Heptagon",
    value: "round-heptagon",
  },
  {
    label: "Round Octagon",
    value: "round-octagon",
  },
];
export const boardEdgeCurveStyles = [
  {
    label: "Straight",
    value: "straight",
  },
  {
    label: "Bezier",
    value: "unbundled-bezier",
  },
  {
    label: "Taxi",
    value: "taxi",
  },
];
export const boardEdgeLineStyles = [
  {
    label: "Solid",
    value: "solid",
  },
  {
    label: "Dashed",
    value: "dashed",
  },
  {
    label: "Dotted",
    value: "dotted",
  },
];
export const boardEdgeTaxiDirections = [
  {
    label: "Auto",
    value: "auto",
  },
  {
    label: "Vertical",
    value: "vertical",
  },
  {
    label: "Horizontal",
    value: "horizontal",
  },
  {
    label: "Upward",
    value: "upward",
  },
  {
    label: "Downward",
    value: "downward",
  },
  {
    label: "Leftward",
    value: "leftward",
  },
  {
    label: "Rightward",
    value: "rightward",
  },
];
export const boardEdgeArrowShapes = [
  {
    label: "None",
    value: "none",
  },
  {
    label: "Triangle",
    value: "triangle",
  },
  {
    label: "Triangle-tee",
    value: "triangle-tee",
  },
  {
    label: "Triangle-cross",
    value: "triangle-cross",
  },
  {
    label: "Triangle-backcurve",
    value: "triangle-backcurve",
  },
  {
    label: "Circle-triangle",
    value: "circle-triangle",
  },
  {
    label: "Vee",
    value: "vee",
  },
  {
    label: "Tee",
    value: "tee",
  },
  {
    label: "Circle",
    value: "circle",
  },
  {
    label: "Diamond",
    value: "diamond",
  },
  {
    label: "Chevron",
    value: "chevron",
  },
];
export const boardEdgeCaps = [
  { label: "Round", value: "round" },
  { label: "Butt", value: "butt" },
  { label: "Square", value: "square" },
];
export function updateColor(
  boardRef: cytoscape.Core,
  color: string | { nodeColor: string; edgeColor: string },
  updateManyNodes: UseMutationResult<
    Response | null,
    unknown,
    {
      ids: string[];
      data: Partial<AllSubItemsType>;
    },
    {
      old: unknown;
    }
  >,
  updateManyEdges: UseMutationResult<
    Response | null,
    unknown,
    {
      ids: string[];
      data: Partial<AllSubItemsType>;
    },
    {
      old: unknown;
    }
  >,
) {
  if (boardRef.elements(":selected")?.length > 0) {
    const nodes = boardRef.elements(":selected").nodes();
    const edges = boardRef.elements(":selected").edges();
    if (nodes.length) {
      updateManyNodes.mutate(
        {
          ids: nodes.map((node) => node.id()),
          data: { backgroundColor: typeof color === "object" ? color.nodeColor : color },
        },
        {
          onSuccess: () => toaster("success", "Node colors successfully updated."),
        },
      );
    }
    if (edges.length)
      updateManyEdges.mutate(
        {
          ids: edges.map((edge) => edge.id()),
          data: {
            lineColor: typeof color === "object" ? color.edgeColor : color,
            targetArrowColor: typeof color === "object" ? color.edgeColor : color,
            sourceArrowColor: typeof color === "object" ? color.edgeColor : color,
            midTargetArrowColor: typeof color === "object" ? color.edgeColor : color,
            midSourceArrowColor: typeof color === "object" ? color.edgeColor : color,
          },
        },
        {
          onSuccess: () => toaster("success", "Edge colors successfully updated."),
        },
      );
  } else {
    toaster("warning", "No elements are selected.");
  }
}

export function exportBoardFunction(
  boardRef: cytoscape.Core,
  view: "Graph" | "View",
  background: "Color" | "Transparent",
  type: "PNG" | "JPEG" | "JSON",
  boardTitle?: string,
) {
  if (!boardRef) return;
  if (type === "PNG") {
    saveAs(
      new Blob(
        [
          boardRef.png({
            output: "blob",
            bg: background === "Color" ? "#121212" : "transparent",
            full: view === "Graph",
          }),
        ],
        {
          type: "image/png",
        },
      ),
      `${boardTitle || "ArkiveBoard"}.png`,
    );
  } else if (type === "JPEG") {
    saveAs(
      new Blob(
        [
          boardRef.jpg({
            output: "blob",
            bg: background === "Color" ? "#121212" : "transparent",
            full: view === "Graph",
          }),
        ],
        {
          type: "image/jpg",
        },
      ),
      `${boardTitle || "ArkiveBoard"}.jpg`,
    );
  } else if (type === "JSON") {
    saveAs(
      new Blob([JSON.stringify(boardRef.json())], {
        type: "application/json",
      }),
      `${boardTitle || "ArkiveBoard"}.json`,
    );
  }
}

export function toModelPosition(boardRef: Core, pos: { x: number; y: number }) {
  const pan = boardRef.pan();
  const zoom = boardRef.zoom();
  return {
    x: (pos.x - pan.x) / zoom,
    y: (pos.y - pan.y) / zoom,
  };
}
export function getNodeImage(node: NodeType) {
  let image = "";
  if (node.document?.image) {
    image = node.document.image;
  }
  if (node.image) {
    image = node.image;
  }
  if (image !== "") return image.replaceAll(" ", "%20");
  return null;
}

export function mapNodes(nodes: NodeType[], isReadOnly?: boolean) {
  return nodes
    .filter((node) => !node.template)
    .map((node: NodeType) => ({
      data: {
        ...node,
        classes: `${isReadOnly ? "publicBoardNode" : "boardNode"}`,
        label: node.label || "",
        zIndexCompare: node.zIndex === 0 ? "manual" : "auto",
        backgroundImage: getNodeImage(node) || [],
      },
      scratch: {
        doc_id: node?.doc_id,
      },
      locked: isReadOnly || node.locked,
      position: { x: node.x, y: node.y },
    }));
}
export function mapEdges(edges: EdgeType[], isReadOnly?: boolean) {
  return edges.map((edge: EdgeType) => ({
    data: {
      ...edge,
      source: edge.source_id,
      target: edge.target_id,
      classes: `boardEdge ${isReadOnly && "publicBoardEdge"}`,
      zIndexCompare: "manual",
      label: edge.label || "",
    },
  }));
}
export const edgeArrowTypes = ["source", "target", "midSource", "midTarget"];
