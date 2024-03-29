import cytoscape, { EdgeCollection, NodeCollection } from "cytoscape";

import { BaseItemType, TagType } from "../generalTypes";
import { DocumentType } from "./documentTypes";

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
export type CurveStyleType = "straight" | "taxi" | "unbundled-bezier";
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
  tags: TagType[];

  fontSize: number;
  fontColor: string;
  fontFamily: string;
  textHAlign: "left" | "center" | "right";
  textVAlign: "top" | "center" | "bottom";
  image?: string | null;
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
  document?: DocumentType;
  parentId: string;
};
export type EdgeType = {
  id: string;
  label?: string;
  tags: TagType[];

  curveStyle?: "straight" | "unbundled-bezier" | "taxi";
  lineStyle?: "solid" | "dashed" | "dotted";
  lineCap?: "butt" | "round" | "square";
  lineFill?: "solid" | "linear-gradient";
  lineOpacity?: number;
  lineColor?: string;
  width?: number;
  controlPointDistances?: number;
  controlPointWeights?: number;
  taxiDirection?: "auto" | "vertical" | "horizontal" | "upward" | "downward" | "leftward" | "rightward";
  taxiTurn?: number;
  arrowScale?: number;

  sourceArrowShape?: ArrowShape;
  sourceArrowFill?: ArrowFill;
  sourceArrowColor?: string;

  targetArrowShape?: ArrowShape;
  targetArrowFill?: ArrowFill;
  targetArrowColor?: string;

  midSourceArrowShape?: ArrowShape;
  midSourceArrowFill?: ArrowFill;
  midSourceArrowColor?: string;

  midTargetArrowShape?: ArrowShape;
  midTargetArrowFill?: ArrowFill;
  midTargetArrowColor?: string;

  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;

  zIndex?: number;

  parentId: string;
  source_id: string;
  target_id: string;
  source: NodeType;
  target: NodeType;
};
export interface BoardType extends BaseItemType {
  defaultNodeShape: NodeShape;
  defaultNodeColor: string;
  defaultEdgeColor: string;
  parent?: BoardType;
  nodes: NodeType[];
  edges: EdgeType[];
}

export type DefaultBoardType = Omit<BoardType, "id" | "project_id" | "nodes" | "edges" | "sort">;
export type DefaultNodeType = Omit<NodeType, "doc_id" | "label">;
export type DefaultEdgeType = Omit<EdgeType, "source_id" | "target_id" | "source" | "target">;
export type BoardCreateType = Partial<Omit<BoardType, "project_id">>;

export type CytoscapeNodeType = cytoscape.NodeDefinition;
export type CytoscapeEdgeType = cytoscape.EdgeDefinition;

export type BoardContextType = null | "board" | "nodes" | "edges";

export type BoardContext = {
  x: null | number;
  y: null | number;
  type: BoardContextType;
  nodes: NodeCollection | null;
  edges: EdgeCollection | null;
};

export type BoardExportType = {
  view: "Graph" | "View";
  background: "Color" | "Transparent";
  type: "PNG" | "JPEG" | "JSON";
};
