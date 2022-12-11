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
  width: number;
  height: number;
  x: number;
  y: number;
  type: NodeShape;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  textHAlign: "left" | "center" | "right";
  textVAlign: "top" | "center" | "bottom";
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
  lineColor: string;
  controlPointDistances: number;
  controlPointWeight: number;
  taxiDirection: "auto" | "vertical" | "horizontal" | "upward" | "downward" | "leftward" | "rightward";
  taxiTurn: number;
  targetArrowShape: ArrowShape;
  sourceArrowShape: ArrowShape;
  midSourceArrowShape: ArrowShape;
  midTargetArrowShape: ArrowShape;
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
  nodes: NodeType[];
  edges: EdgeType[];
}

export type DefaultBoardType = Omit<BoardType, "id" | "project_id" | "nodes" | "edges">;
export type DefaultNodeType = Omit<NodeType, "doc_id" | "label">;
export type BoardCreateType = Partial<Omit<BoardType, "project_id">> & {
  project_id: string;
};

export type CytoscapeNodeType = cytoscape.NodeDefinition;
// Custom image has priority, if not set use document image, if neither - empty array
// Empty string ("") causes issues with cytoscape, so an empty array must be used
// backgroundImage: node.customImage?.link
//   ? `${supabaseStorageImagesLink}${node.customImage.link.replaceAll(" ", "%20")}`
//   : node.document?.image?.link
//   ? `${supabaseStorageImagesLink}${node.document.image.link?.replaceAll(" ", "%20")}`
//   : [],
