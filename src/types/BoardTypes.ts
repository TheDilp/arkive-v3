import { ImageProps } from "../custom-types";

// Board props
export type BoardProps = {
  id: string;
  title: string;
  parent: { id: string; title: string } | null;
  project_id: string;
  nodes: BoardNodeProps[];
  edges: BoardEdgeProps[];
  defaultNodeColor: string;
  defaultEdgeColor: string;
  folder: boolean;
  expanded: boolean;
  public: boolean;
  sort: number;
};

export type CreateBoardProps = {
  id: string;
  title: string;
  project_id: string;
  parent?: string | null;
  folder: boolean;
};

export type UpdateBoardProps = {
  id: string;
  title?: string;
  parent?: string | null;
  expanded?: boolean;
  defaultNodeColor?: string;
  defaultEdgeColor?: string;
  public?: boolean;
};
export type UpdateBoardInputs = Pick<BoardProps, "title"> & {
  parent: string;
};

export type BoardExportProps = {
  view: "Graph" | "View";
  background: "Color" | "Transparent";
  type: "PNG" | "JPEG" | "JSON";
  show: boolean;
};

export type BoardContextMenuProps = {
  x: number;
  y: number;
  type: "board" | "node" | "edge";
  selected?: any;
};
export type BoardItemDisplayDialogProps = {
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

export type BoardNodeProps = {
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
export type CytoscapeNodeProps = {
  data: Pick<
    BoardNodeProps,
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
  position: Pick<BoardNodeProps, "x" | "y">;
  locked: boolean;
};
export type CreateNodeProps = {
  id: string;
  label?: string;
  x: number;
  y: number;
  board_id: string;
  type: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
  customImage?: ImageProps;
  doc_id?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
  textHAlign?: "left" | "center" | "right";
  textVAlign?: "top" | "center" | "bottom";
  zIndex?: number;
  locked?: boolean;
};
export type UpdateNodeProps = {
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
  NodeUpdateDialogProps,
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
export type NodeUpdateDialogProps = {
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
export type BoardEdgeProps = {
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

export type CytoscapeEdgeProps = {
  data: Pick<
    BoardEdgeProps,
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

export type UpdateEdgeInputs = Pick<
  EdgeUpdateDialogProps,
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

export type UpdateEdgeProps = {
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
export type EdgeUpdateDialogProps = {
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
