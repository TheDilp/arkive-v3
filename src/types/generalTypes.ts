import React from "react";
import { RemirrorJSON } from "remirror";

import { BoardType, EdgeType, NodeType } from "./boardTypes";
import { DocumentType } from "./documentTypes";
import { MapLayerType, MapPinType, MapType } from "./mapTypes";
import { CardType, ScreenType, SectionType } from "./screenTypes";

export type AvailableItemTypes = "documents" | "maps" | "boards" | "screens";
export type AvailableSubItemTypes = "map_pins" | "map_layers" | "nodes" | "edges" | "sections" | "cards";
export type AllAvailableTypes = AvailableItemTypes | AvailableSubItemTypes;

export type AllItemsType = DocumentType | MapType | BoardType | ScreenType;
export type AllSubItemsType = MapPinType | MapLayerType | NodeType | EdgeType | SectionType | CardType;

export type AvailableSearchResultTypes = "documents" | "maps" | "boards" | "pins" | "nodes" | "edges" | "screens" | "sections";

export type IconSelectMenuType = {
  // eslint-disable-next-line no-unused-vars
  setIcon: (newIcon: string) => void;
  close: () => void;
};
export interface TagType {
  id: string;
  title: string;
  project_id: string;
}
export type TagCreateType = {
  id: string;
  title: string;
  docId?: string;
  mapId?: string;
  mapPinId?: string;
  boardId?: string;
  nodeId?: string;
  edgeId?: string;
  screenId?: string;
};
export type TagUpdateType = {
  title: string;
  [key: string]: any;
};

export interface TagSettingsType extends TagType {
  documents: Pick<DocumentType, "id" | "title" | "icon" | "folder">[];
  maps: Pick<MapType, "id" | "title" | "icon" | "folder">[];
  map_pins: Pick<MapPinType, "id" | "text" | "icon">[];
  boards: Pick<BoardType, "id" | "title" | "icon" | "folder">[];
  nodes: Pick<NodeType, "id" | "label" | "parentId">[];
  edges: Pick<EdgeType, "id" | "label" | "parentId">[];
  screens: Pick<ScreenType, "id" | "title" | "icon" | "folder">[];
}

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

export type FullSearchResults = {
  documents: DocumentType[];
  maps: MapType[];
  boards: BoardType[];
  nodes: NodeType[];
  edges: EdgeType[];
  pins: MapPinType[];
};
