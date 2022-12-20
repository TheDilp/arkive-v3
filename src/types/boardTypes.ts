import cytoscape from "cytoscape";

import { BaseItemType } from "./generalTypes";

type ArrowShape =
  | "none"
  | "triangle"
  | "triangle-tee"
  | "triangle-cross"
  | "triangle-backcurve"
  | "circle-triangle"
  | "vee"
  | "tee"
  | "circle"
  | "diamond"
  | "chevron";

type ArrowFill = "filled" | "hollow";

type NodeShape =
  | "rectangle"
  | "ellipse"
  | "triangle"
  | "barrel"
  | "rhomboid"
  | "diamond"
  | "pentagon"
  | "hexagon"
  | "heptagon"
  | "octagon"
  | "star"
  | "cut-rectangle"
  | "round-triangle"
  | "round-rectangle"
  | "bottom-round-rectangle"
  | "round-diamond"
  | "round-pentagon"
  | "round-hexagon"
  | "round-heptagon"
  | "round-octagon";

export type NodeType = {
  id: string;
  label?: string;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  textHAlign: "left" | "center" | "right";
  textVAlign: "top" | "center" | "bottom";
  image?: string;
  width: number;
  height: number;
  x: number;
  y: number;
  type: NodeShape;
  backgroundColor: string;
  backgroundOpacity: number;
  locked: boolean;
  template: boolean;
  zIndex: number;
  doc_id?: string;
  parent: string;
};
export type EdgeType = {
  id: string;
  label?: string;

  curveStyle: "straight" | "bezier" | "taxi";
  lineStyle: "solid" | "dashed" | "dotted";
  lineCap: "butt" | "round" | "square";
  lineFill: "solid" | "linear-gradient";
  lineOpacity: number;
  lineColor: string;
  width: number;
  controlPointDistances: number;
  controlPointWeights: number;
  taxiDirection: "auto" | "vertical" | "horizontal" | "upward" | "downward" | "leftward" | "rightward";
  taxiTurn: number;
  arrowScale: number;

  sourceArrowShape: ArrowShape;
  sourceArrowFill: ArrowFill;
  sourceArrowColor: string;

  targetArrowShape: ArrowShape;
  targetArrowFill: ArrowFill;
  targetArrowColor: string;

  midSourceArrowShape: ArrowShape;
  midSourceArrowFill: ArrowFill;
  midSourceArrowColor: string;

  midTargetArrowShape: ArrowShape;
  midTargetArrowFill: ArrowFill;
  midTargetArrowColor: string;

  fontSize: number;
  fontColor: string;
  fontFamily: string;

  zIndex: number;
  source_id: string;
  target_id: string;
  parent: string;
};
export interface BoardType extends BaseItemType {
  defaultNodeColor: string;
  defaultEdgeColor: string;
  defaultGrid: boolean;
  nodes: NodeType[];
  edges: EdgeType[];
}

export type DefaultBoardType = Omit<BoardType, "id" | "project_id" | "nodes" | "edges">;
export type DefaultNodeType = Omit<NodeType, "doc_id" | "label">;
export type DefaultEdgeType = Omit<EdgeType, "source_id" | "target_id" | "label">;
export type BoardCreateType = Partial<Omit<BoardType, "project_id">> & {
  project_id: string;
};

export type CytoscapeNodeType = cytoscape.NodeDefinition;
export type CytoscapeEdgeType = cytoscape.EdgeDefinition;

export type BoardExportType = {
  view: "Graph" | "View";
  background: "Color" | "Transparent";
  type: "PNG" | "JPEG" | "JSON";
};
