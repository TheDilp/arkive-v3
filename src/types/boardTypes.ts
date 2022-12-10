import { BaseItemType } from "./generalTypes";

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
export interface BoardType extends BaseItemType {
  defaultNodeColor: string;
  defaultEdgeColor: string;
  nodes: NodeType[];
  edges: EdgeType[];
}

export type DefaultBoardType = Omit<BoardType, "id" | "project_id" | "nodes" | "edges">;

export type BoardCreateType = Partial<Omit<BoardType, "project_id">> & {
  project_id: string;
};
