import cytoscape from "cytoscape";
import { z as zod } from "zod";

import { BaseItemSchema } from "./generalTypes";

const ArrowShape = [
  "none",
  "triangle",
  "triangle-tee",
  "triangle-cross",
  "triangle-backcurve",
  "circle-triangle",
  "vee",
  "tee",
  "circle",
  "diamond",
  "chevron",
] as const;

const NodeSchema = zod.object({
  id: zod.string(),
  label: zod.string().nullish(),
  width: zod.number(),
  height: zod.number(),
  x: zod.number(),
  y: zod.number(),
  type: zod.enum([
    "rectangle",
    "ellipse",
    "triangle",
    "barrel",
    "rhomboid",
    "diamond",
    "pentagon",
    "hexagon",
    "heptagon",
    "octagon",
    "star",
    "cut-rectangle",
    "round-triangle",
    "round-rectangle",
    "bottom-round-rectangle",
    "round-diamond",
    "round-pentagon",
    "round-hexagon",
    "round-heptagon",
    "round-octagon",
  ]),
  fontSize: zod.number(),
  fontColor: zod.string(),
  fontFamily: zod.string(),
  textHAlign: zod.enum(["left", "center", "right"]),
  textVAlign: zod.enum(["top", "center", "bottom"]),
  backgroundColor: zod.string(),
  backgroundOpacity: zod.number(),
  locked: zod.boolean(),
  template: zod.boolean(),
  zIndex: zod.number(),
  doc_id: zod.string().nullish(),
  parent: zod.string(),
});

const EdgeSchema = zod.object({
  id: zod.string(),
  label: zod.string().nullish(),
  curveStyle: zod.enum(["straight", "bezier", "taxi"]),
  lineStyle: zod.enum(["solid", "dashed", "dotted"]),
  lineCap: zod.enum(["butt", "round", "square"]),
  lineFill: zod.enum(["solid", "linear-gradient"]),
  lineOpacity: zod.number(),
  lineColor: zod.string(),
  width: zod.number(),
  controlPointDistances: zod.number(),
  controlPointWeights: zod.number(),
  taxiTurn: zod.number(),
  taxiDirection: zod.enum(["auto", "vertical", "horizontal", "upward", "downward", "leftward", "rightward"]),

  fontSize: zod.number(),
  fontColor: zod.string(),
  fontFamily: zod.string(),
  zIndex: zod.number(),
  source_id: zod.string(),
  target_id: zod.string(),
  parent: zod.string(),

  arrowScale: zod.number(),

  sourceArrowShape: zod.enum(ArrowShape),
  sourceArrowFill: zod.enum(["filled", "hollow"]),
  sourceArrowColor: zod.string(),

  targetArrowShape: zod.enum(ArrowShape),
  targetArrowFill: zod.enum(["filled", "hollow"]),
  targetArrowColor: zod.string(),

  midSourceArrowShape: zod.enum(ArrowShape),
  midSourceArrowFill: zod.enum(["filled", "hollow"]),
  midSourceArrowColor: zod.string(),

  midTargetArrowShape: zod.enum(ArrowShape),
  midTargetArrowFill: zod.enum(["filled", "hollow"]),
  midTargetArrowColor: zod.string(),
});

export type NodeType = zod.infer<typeof NodeSchema>;
export type EdgeType = zod.infer<typeof EdgeSchema>;

const BoardSchema = BaseItemSchema.extend({
  defaultNodeColor: zod.string(),
  defaultEdgeColor: zod.string(),
  defaultGrid: zod.boolean(),
  nodes: zod.array(NodeSchema),
  edges: zod.array(EdgeSchema),
});

export type BoardType = zod.infer<typeof BoardSchema>;

export type DefaultBoardType = Omit<BoardType, "id" | "project_id" | "nodes" | "edges">;
export type DefaultNodeType = Omit<NodeType, "doc_id" | "label">;
export type DefaultEdgeType = Omit<EdgeType, "source_id" | "target_id" | "label">;
export type BoardCreateType = Partial<Omit<BoardType, "project_id">> & {
  project_id: string;
};

export type CytoscapeNodeType = cytoscape.NodeDefinition;
export type CytoscapeEdgeType = cytoscape.EdgeDefinition;
