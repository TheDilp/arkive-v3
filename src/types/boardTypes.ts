export type NodeType = {
  id: string;
  label?: string;
  width: number;
  height: number;
  x: number;
  y: number;
  type: string;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  textVAlign: string;
  textHAlign: string;
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
  curveStyle: string;
  lineStyle: string;
  lineColor: string;
  controlPointDistances: number;
  controlPointWeight: number;
  taxiDirection: string;
  taxiTurn: number;
  targetArrowShape: string;
  sourceArrowShape: string;
  midSourceArrowShape: string;
  midTargetArrowShape: string;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  zIndex: number;

  source_id: string;
  target_id: string;
  parent: string;
};
export type BoardType = {
  id: string;
  title: string;
  folder: boolean;
  public: boolean;
  expanded: boolean;
  sort: number;
  parent: string | null;
  defaultNodeColor: string;
  defaultEdgeColor: string;
  project_id: string;
};

export type DefaultBoardType = Omit<BoardType, "id" | "project_id">;

export type BoardCreateType = Partial<Omit<BoardType, "project_id">> & {
  project_id: string;
};
