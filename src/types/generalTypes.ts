import React from "react";
import { RemirrorJSON } from "remirror";
import { z as zod } from "zod";
import { BoardType, EdgeType, NodeType } from "./boardTypes";
import { DocumentType } from "./documentTypes";
import { MapLayerType, MapPinType, MapType } from "./mapTypes";

export type AvailableItemTypes = "documents" | "maps" | "boards" | "timelines";
export type AvailableSubItemTypes = "map_pins" | "map_layers" | "nodes" | "edges";
export type AllAvailableTypes = AvailableItemTypes | AvailableSubItemTypes;

export type AllItemsType = DocumentType | MapType | BoardType;
export type AllSubItemsType = MapPinType | MapLayerType | NodeType | EdgeType;

export type AvailableSearchResultTypes = "documents" | "maps" | "boards" | "nodes" | "pins";

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

export const BaseItemSchema = zod.object({
  id: zod.string(),
  project_id: zod.string(),
  title: zod.string(),
  parent: zod.string().nullable(),
  icon: zod.string(),
  sort: zod.number(),
  folder: zod.boolean(),
  expanded: zod.boolean(),
  public: zod.boolean(),
  tags: zod.array(zod.string()),
});
