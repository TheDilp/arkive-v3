import React from "react";
import { RemirrorJSON } from "remirror";

import { BoardType, EdgeType, NodeType } from "./boardTypes";
import { DocumentType } from "./documentTypes";
import { MapLayerType, MapPinType, MapType } from "./mapTypes";

export type AvailableItemTypes = "documents" | "maps" | "boards" | "timelines";
export type AvailableSubItemTypes = "map_pins" | "map_layers" | "nodes" | "edges";
export type AllAvailableTypes = AvailableItemTypes | AvailableSubItemTypes;

export type AllItemsType = DocumentType | MapType | BoardType;
export type AllSubItemsType = MapPinType | MapLayerType | NodeType | EdgeType;

export type AvailableSearchResultTypes = "documents" | "maps" | "boards" | "pins" | "nodes" | "edges";

export type IconSelectMenuType = {
  // eslint-disable-next-line no-unused-vars
  setIcon: (newIcon: string) => void;
  close: () => void;
};
export type TagType = {
  id: string;
  title: string;
  project_id: string;
};
export type TagCreateType = {
  title: string;
  docId?: string;
  mapId?: string;
  mapPinId?: string;
  boardId?: string;
  nodeId?: string;
  edgeId?: string;
};
export type TagUpdateType = {
  title: string;
  [key: string]: any;
};
export type EditorType = {
  content?: RemirrorJSON | undefined;
  editable?: boolean;
};
export type BreadcrumbsType = { template: React.ReactNode }[];

export interface BaseItemType {
  id: string;
  project_id: string;
  title: string;
  icon: string;
  parentId: string | null;
  sort: number;
  folder: boolean;
  isPublic: boolean;
  expanded: boolean;
  tags: TagType[];
}

export type slashMenuItem = {
  name: string;
  type:
    | "heading"
    | "list"
    | "quote"
    | "callout"
    | "image"
    | "divider"
    | "columns_select"
    | "columns"
    | "secret"
    | "map_select"
    | "map"
    | "board_select"
    | "board";
  icon: string;
  map_id?: string;
  board_id?: string;
  level?: number;
  callout_type?: string;
  color?: string;
  column_count?: number;
};

export type DragItem = { id: string; image?: string; title: string; type: "documents" | "images" };

export interface SettingsTagsResults {
  documents: DocumentType[];
  maps: MapType[];
  boards: BoardType[];
  nodes: NodeType[];
  edges: EdgeType[];
}
export interface FullSearchResults extends SettingsTagsResults {
  pins: MapPinType[];
}
