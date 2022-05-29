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
  image?: ImageProps;
  project_id: string;
  categories: string[];
  parent: { id: string; title: string } | null;
  nodes?: {
    id: string;
    label: string;
    sources?: { id: string; target: { id: string; label: string } }[];
    targets?: { id: string; source: { id: string; label: string } }[];
  }[];
  icon: string;
  folder: boolean;
  template: boolean;
  expanded: boolean;
  public: boolean;
};

export type MapProps = {
  id: string;
  title: string;
  map_image?: ImageProps;
  parent: { id: string; title: string } | null;
  folder: boolean;
  expanded: boolean;
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
  parent: { id: string; title: string } | null;
  folder: boolean;
  expanded: boolean;
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
  customImage?: ImageProps;
  backgroundColor: string;
  backgroundOpacity: number;
  zIndex: number;
  document?: {
    id: string;
    image?: {
      link?: string;
    };
  };
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
export type ImageProps = {
  id: string;
  title: string;
  link: string;
  type: "Image" | "Map";
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
  parent: string;
  template: boolean;
  depth: number;
};
export type mapItemDisplayDialogProps = {
  id: string;
  title: string;
  map_image: ImageProps;
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
  expanded: boolean;
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
  customImage?: ImageProps;
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
  id: string;
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
  map_image: ImageProps;
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
export type UpdateBoardInputs = Pick<BoardProps, "title" | "layout"> & {
  parent: string;
};
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

export type DocumentCreateProps = {
  id?: string;
  title?: string;
  icon?: string;
  image?: string;
  project_id: string;
  parent?: string | null;
  categories?: string[];
  folder?: boolean;
  content?: RemirrorJSON | null;
};
export type DocumentUpdateProps = {
  id: string;
  title?: string;
  content?: RemirrorJSON | null;
  folder?: boolean;
  parent?: string | null;
  image?: string;
  icon?: string;
  expanded?: boolean;
  categories?: string[];
};
export type TemplateCreateProps = {
  id: string;
  title: string;
  content: RemirrorJSON;
  project_id: string;
  icon?: string;
  image?: string;
  parent?: string | null;
  categories?: string[];
  folder?: boolean;
};

export type MapCreateProps = {
  id: string;
  title: string;
  map_image: string | undefined;
  project_id: string;
  parent?: string | null;
  folder?: boolean;
  expanded: false;
};

export type MapUpdateProps = {
  id: string;
  title?: string;
  map_image?: ImageProps;
  parent?: string | null;
  expanded?: boolean;
};

export type CreateMapMarkerProps = {
  id: string;
  map_id: string;
  lat: number;
  lng: number;
  icon?: string;
  color?: string;
  text?: string;
  doc_id?: string;
  map_link?: string;
};

export type UpdateMapMarkerProps = {
  id: string;
  map_id: string;
  text?: string;
  icon?: string;
  color?: string;
  lat?: number;
  lng?: number;
  doc_id?: string;
  map_link?: string;
};

export type CreateBoardProps = {
  id: string;
  title: string;
  project_id: string;
  parent?: string | null;
  folder: boolean;
  layout: string;
};

export type UpdateBoardProps = {
  id: string;
  title?: string;
  parent?: string | null;
  layout?: string;
  expanded?: boolean;
};

export type CreateNodeProps = {
  id: string;
  label?: string;
  x: number;
  y: number;
  board_id: string;
  type: string;
  backgroundColor?: string;
  customImage?: ImageProps;
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
  customImage?: string;
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
