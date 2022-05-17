import { RemirrorJSON } from "@remirror/core";
export type ProjectProps = {
  id: string;
  backgroundImage: string;
  cardImage: string;
  logoImage: string;
  title: string;
  user_id: string;
  categories: string[];
  createdAt: Date;
};

export type DocumentProps = {
  id: string;
  title: string;
  content: RemirrorJSON | null;
  image: string;
  project_id: string;
  categories: string[];
  parent: { id: string; title: string } | null;
  folder: boolean;
  icon: string;
  template: boolean;
  expanded: boolean;
};

export type MapProps = {
  id: string;
  title: string;
  map_image: string;
  parent: string | null;
  folder: boolean;
  user_id: string;
  project_id: string;
  markers: MapMarkerProps[];
};
export type MapMarkerProps = {
  id: string;
  icon: string;
  color: string;
  lat: number;
  lng: number;
  text: string;
  map_id: string;
  doc_id?: string;
  map_link?: string;
};
export type BoardProps = {
  id: string;
  title: string;
  parent?: string | null;
  folder: boolean;
  project_id: string;
  layout: string;
  nodes: BoardNodeProps[];
  edges: BoardEdgeProps[];
};
export type BoardNodeProps = {
  id: string;
  label?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  fontSize: number;
  textHAlign: "left" | "center" | "right";
  textVAlign: "top" | "center" | "bottom";
  customImage?: string | null;
  backgroundColor: string;
  backgroundOpacity: number;
  zIndex: number;
  document?: Pick<DocumentProps, "id" | "image">;
  board_id: string;
};

export type BoardEdgeProps = {
  id: string;
  board_id: string;
  label?: string;
  source: string;
  target: string;
  curveStyle: string;
  lineStyle: string;
  lineColor: string;
  controlPointDistances: number;
  controlPointWeights: number;
  taxiDirection: string;
  taxiTurn: number;
  targetArrowShape: string;
  zIndex: number;
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
    | "backgroundColor"
    | "textHAlign"
    | "textVAlign"
    | "customImage"
  >;
  position: Pick<BoardNodeProps, "x" | "y">;
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
    | "controlPointDistances"
    | "controlPointWeights"
    | "taxiDirection"
    | "taxiTurn"
    | "targetArrowShape"
    | "zIndex"
  >;
};
export type docItemDisplayDialogProps = {
  id: string;
  title: string;
  show: boolean;
  folder: boolean;
  template: boolean;
  depth: number;
};
export type mapItemDisplayDialogProps = {
  id: string;
  title: string;
  map_image: string;
  parent: string;
  show: boolean;
  folder: boolean;
  depth: number;
};
export type boardItemDisplayDialogProps = {
  id: string;
  title: string;
  parent: string;
  folder: boolean;
  layout: string;
  depth: number;
  show: boolean;
};
export type nodeUpdateDialogProps = {
  id: string;
  label: string;
  type: string;
  height: number;
  width: number;
  fontSize: number;
  doc_id?: string;
  customImage?: string | null;
  textHAlign: "left" | "center" | "right";
  textVAlign: "top" | "center" | "bottom";
  backgroundColor: string;
  backgroundOpacity: number;
  zIndex: number;
  show: boolean;
};
export type edgeUpdateDialogProps = {
  id: string;
  label: string;
  curveStyle: string;
  lineStyle: string;
  lineColor: string;
  controlPointDistances: number;
  controlPointWeights: number;
  taxiDirection: string;
  taxiTurn: number;
  targetArrowShape: string;
  zIndex: number;
  show: boolean;
};
export type BoardExportProps = {
  view: "Graph" | "View";
  background: "Color" | "Transparent";
  type: "PNG" | "JPEG" | "JSON";
  show: boolean;
};
export type iconSelectProps = {
  doc_id: string;
  icon: string;
  top: number;
  left: number;
  show: boolean;
};

export type ProfileProps = {
  id: string;
  nickname: string;
  user_id: string;
  profile_image: string;
};

export type UserProfileProps = {
  user_id: string;
  nickname: string;
};

export type BoardContextMenuProps = {
  x: number;
  y: number;
  type: "board" | "node" | "edge";
  selected?: any;
};
// Inputs for creating
export type CreateDocumentInputs = {
  title: string;
  image: string;
  parent: string;
  icon: string;
  folder: boolean;
  template: boolean;
};
export type CreateMapInputs = {
  title: string;
  map_image: string;
  parent: string;
  folder: boolean;
};
export type CreateMarkerInputs = {
  icon: string;
  text: string;
  color: string;
  doc_id: string;
  map_link: string;
};

// Inputs for updating
export type UpdateMarkerInputs = {
  icon: string;
  text: string;
  color: string;
  doc_id?: string;
  map_link?: string;
};
export type UpdateBoardInputs = Pick<BoardProps, "title" | "layout" | "parent">;
export type UpdateNodeInputs = Pick<
  nodeUpdateDialogProps,
  | "label"
  | "type"
  | "doc_id"
  | "width"
  | "height"
  | "fontSize"
  | "customImage"
  | "textHAlign"
  | "textVAlign"
  | "backgroundColor"
  | "backgroundOpacity"
  | "zIndex"
>;
export type UpdateEdgeInputs = Pick<
  edgeUpdateDialogProps,
  | "label"
  | "curveStyle"
  | "lineStyle"
  | "lineColor"
  | "controlPointDistances"
  | "controlPointWeights"
  | "taxiDirection"
  | "taxiTurn"
  | "targetArrowShape"
  | "zIndex"
>;
export type RegisterInputs = {
  email: string;
  password: string;
};

// DATA CREATION AND UPDATE TYPES

export type CreateNodeProps = {
  id: string;
  label?: string;
  x: number;
  y: number;
  board_id: string;
  type: string;
  backgroundColor?: string;
  doc_id?: string;
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
  textHAlign?: "left" | "center" | "right";
  textVAlign?: "top" | "center" | "bottom";
  backgroundColor?: string;
  backgroundOpacity?: number;
  customImage?: string | null;
  zIndex?: number;
  doc_id?: string;
};

export type UpdateEdgeProps = {
  id: string;
  board_id: string;
  label?: string;
  curveStyle?: string;
  lineStyle?: string;
  lineColor?: string;
  controlPointDistances?: number;
  controlPointWeights?: number;
  taxiDirection?: string;
  taxiTurn?: number;
  targetArrowShape?: string;
  zIndex: number;
};
