import { ImageProps } from "../custom-types";

// Board props
export type BoardType = {
  id: string;
  title: string;
  parent: { id: string; title: string } | null;
  project_id: string;
  nodes: BoardNodeType[];
  edges: BoardEdgeType[];
  defaultNodeColor: string;
  defaultEdgeColor: string;
  folder: boolean;
  expanded: boolean;
  public: boolean;
  sort: number;
};

export type CreateBoardType = {
  id: string;
  title: string;
  project_id: string;
  parent?: string | null;
  folder: boolean;
};

export type UpdateBoardType = {
  id: string;
  title?: string;
  parent?: string | null;
  expanded?: boolean;
  defaultNodeColor?: string;
  defaultEdgeColor?: string;
  public?: boolean;
};
export type UpdateBoardInputs = Pick<BoardType, "title"> & {
  parent: string;
};

export type BoardExportType = {
  view: "Graph" | "View";
  background: "Color" | "Transparent";
  type: "PNG" | "JPEG" | "JSON";
  show: boolean;
};

export type BoardContextMenuType = {
  x: number;
  y: number;
  type: "board" | "node" | "edge";
};
export type BoardItemDisplayDialogType = {
  id: string;
  title: string;
  parent: string;
  depth: number;
  folder: boolean;
  expanded: boolean;
  defaultNodeColor: string;
  defaultEdgeColor: string;
  public: boolean;
  show: boolean;
};

// Node Props

export type BoardNodeType = {
  id: string;
  label?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  textHAlign: "left" | "center" | "right";
  textVAlign: "top" | "center" | "bottom";
  customImage?: ImageProps;
  backgroundColor: string;
  backgroundOpacity: number;
  zIndex: number;
  locked: boolean;
  document?: {
    id: string;
    image?: {
      link?: string;
    };
  };
  board_id: string;
};
export type CytoscapeNodeType = {
  data: Pick<
    BoardNodeType,
    | "id"
    | "label"
    | "width"
    | "height"
    | "type"
    | "x"
    | "y"
    | "fontSize"
    | "fontColor"
    | "fontFamily"
    | "backgroundColor"
    | "backgroundOpacity"
    | "textHAlign"
    | "textVAlign"
    | "customImage"
  >;
  position: Pick<BoardNodeType, "x" | "y">;
  locked: boolean;
};
export type CreateNodeType = {
  id: string;
  label?: string;
  x: number;
  y: number;
  board_id: string;
  type: string;
  backgroundColor: string;
  backgroundOpacity: number;
  customImage?: ImageProps;
  doc_id?: string;
  width: number;
  height: number;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  textHAlign: "left" | "center" | "right";
  textVAlign: "top" | "center" | "bottom";
  zIndex: number;
  locked: boolean;
  template: boolean;
};
export type UpdateNodeType = {
  id: string;
  label?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  type?: string;
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
  textHAlign?: "left" | "center" | "right";
  textVAlign?: "top" | "center" | "bottom";
  backgroundColor?: string;
  backgroundOpacity?: number;
  customImage?: string;
  zIndex?: number;
  doc_id?: string;
  locked?: boolean;
};
export type UpdateNodeInputs = Pick<
  NodeUpdateDialogType,
  | "label"
  | "type"
  | "doc_id"
  | "width"
  | "height"
  | "fontSize"
  | "fontColor"
  | "customImage"
  | "textHAlign"
  | "textVAlign"
  | "backgroundColor"
  | "backgroundOpacity"
  | "zIndex"
>;
export type NodeUpdateDialogType = {
  id: string;
  label: string;
  type: string;
  height: number;
  width: number;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  doc_id?: string;
  customImage?: ImageProps;
  textHAlign: "left" | "center" | "right";
  textVAlign: "top" | "center" | "bottom";
  backgroundColor: string;
  backgroundOpacity: number;
  zIndex: number;
  show: boolean;
};

// Edge Props

export type BoardEdgeType = {
  id: string;
  board_id: string;
  label?: string;
  source: string;
  target: string;
  curveStyle: string;
  lineStyle: string;
  lineColor: string;
  fontColor: string;
  fontFamily: string;
  fontSize: number;
  controlPointDistances: number;
  controlPointWeights: number;
  taxiDirection: string;
  taxiTurn: number;
  targetArrowShape: string;
  zIndex: number;
};

export type CytoscapeEdgeType = {
  data: Pick<
    BoardEdgeType,
    | "id"
    | "label"
    | "source"
    | "target"
    | "curveStyle"
    | "lineStyle"
    | "lineColor"
    | "fontColor"
    | "fontFamily"
    | "fontSize"
    | "controlPointDistances"
    | "controlPointWeights"
    | "taxiDirection"
    | "taxiTurn"
    | "targetArrowShape"
    | "zIndex"
  >;
};

export type CreateEdgeType = {
  id: string;
  board_id: string;
  label?: string;
  source: string;
  target: string;
  curveStyle: string;
  lineStyle: string;
  lineColor: string;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  controlPointDistances: number;
  controlPointWeights: number;
  taxiDirection: string;
  taxiTurn: number;
  targetArrowShape: string;
  zIndex: number;
};

export type UpdateEdgeInputs = Pick<
  EdgeUpdateDialogType,
  | "label"
  | "curveStyle"
  | "lineStyle"
  | "lineColor"
  | "fontColor"
  | "fontFamily"
  | "fontSize"
  | "controlPointDistances"
  | "controlPointWeights"
  | "taxiDirection"
  | "taxiTurn"
  | "targetArrowShape"
  | "zIndex"
>;

export type UpdateEdgeType = {
  id: string;
  board_id: string;
  label?: string;
  curveStyle?: string;
  lineStyle?: string;
  lineColor?: string;
  fontColor?: string;
  fontFamily?: string;
  fontSize?: number;
  controlPointDistances?: number;
  controlPointWeights?: number;
  taxiDirection?: string;
  taxiTurn?: number;
  targetArrowShape?: string;
  zIndex?: number;
};
export type EdgeUpdateDialogType = {
  id: string;
  label: string;
  curveStyle: string;
  lineStyle: string;
  lineColor: string;
  fontColor: string;
  fontFamily: string;
  fontSize: number;
  controlPointDistances: number;
  controlPointWeights: number;
  taxiDirection: string;
  taxiTurn: number;
  targetArrowShape: string;
  zIndex: number;
  show: boolean;
};

export type BoardStateType = {
  drawMode: boolean;
  quickCreate: boolean;
  drawGrid: boolean;
};

export type BoardStateAction =
  | { type: "DRAW"; payload: boolean }
  | { type: "QUICK"; payload: boolean }
  | { type: "GRID"; payload: boolean };
