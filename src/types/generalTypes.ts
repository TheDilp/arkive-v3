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

export type EditorType = {
  content?: RemirrorJSON | undefined;
  editable?: boolean;
};
export type BreadcrumbsType = { template: React.ReactNode }[];

export interface BaseItemType {
  id: string;
  project_id: string;
  title: string;
  parent: string | null;
  icon: string;
  sort: number;
  folder: boolean;
  public: boolean;
  expanded: boolean;
  tags: string[];
}
