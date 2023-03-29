import React from "react";
import { RemirrorJSON } from "remirror";

import { BoardType, EdgeType, NodeType } from "./ItemTypes/boardTypes";
import { CalendarType, EventType, MonthType } from "./ItemTypes/calendarTypes";
import { DictionaryType, WordType } from "./ItemTypes/dictionaryTypes";
import { DocumentType } from "./ItemTypes/documentTypes";
import { MapLayerType, MapPinType, MapType } from "./ItemTypes/mapTypes";
import { ProjectType } from "./ItemTypes/projectTypes";
import { RandomTableOptionType, RandomTableType } from "./ItemTypes/randomTableTypes";
import { CardType, ScreenType, SectionType } from "./ItemTypes/screenTypes";
import { TimelineType } from "./ItemTypes/timelineTypes";
import { UserType } from "./userTypes";

export type AvailableItemTypes =
  | "documents"
  | "maps"
  | "boards"
  | "screens"
  | "dictionaries"
  | "calendars"
  | "timelines"
  | "randomtables";
export type AvailableSubItemTypes =
  | "alter_names"
  | "map_pins"
  | "map_layers"
  | "nodes"
  | "edges"
  | "sections"
  | "cards"
  | "words"
  | "eras"
  | "months"
  | "events"
  | "randomtableoptions";
export type AllAvailableTypes = AvailableItemTypes | AvailableSubItemTypes;

export type AllItemsType = DocumentType | MapType | BoardType | CalendarType | ScreenType | DictionaryType | RandomTableType;
export type AllSubItemsType =
  | MapPinType
  | MapLayerType
  | NodeType
  | EdgeType
  | SectionType
  | CardType
  | WordType
  | MonthType
  | RandomTableOptionType;

export type AvailableSearchResultTypes =
  | "documents"
  | "maps"
  | "boards"
  | "pins"
  | "nodes"
  | "edges"
  | "screens"
  | "sections"
  | "calendars"
  | "timelines"
  | "events";

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
  map_pins: Pick<MapPinType, "id" | "text" | "icon" | "parentId">[];
  boards: Pick<BoardType, "id" | "title" | "icon" | "folder">[];
  nodes: Pick<NodeType, "id" | "label" | "parentId">[];
  edges: Pick<EdgeType, "id" | "label" | "parentId" | "source" | "target">[];
  calendars: Pick<CalendarType, "id" | "title" | "icon" | "folder">[];
  events: Pick<EventType, "id" | "title" | "calendarsId">[];
  screens: Pick<ScreenType, "id" | "title" | "icon" | "folder">[];
  cards: Pick<CardType, "id" | "parentId" | "document">[];
  dictionaries: Pick<DictionaryType, "id" | "title" | "icon" | "folder">[];
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
export type NavItemType = {
  icon: string;
  navigate: string;
  tooltip: string;
};

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

export type BoardDragItemType = { id: string; image?: string; title: string; type: "documents" | "images" };

export type SearchResultType =
  | DocumentType
  | MapType
  | MapPinType
  | BoardType
  | NodeType
  | EdgeType
  | ScreenType
  | SectionType
  | CalendarType
  | TimelineType
  | EventType;

export type FullSearchResults = {
  documents: DocumentType[];
  maps: MapType[];
  boards: BoardType[];
  nodes: NodeType[];
  edges: EdgeType[];
  pins: MapPinType[];
  screens: ScreenType[];
  sections: SectionType[];
  calendars: CalendarType[];
  timelines: TimelineType[];
  events: EventType[];
};

export type MemberType = {
  id: string;
  project: ProjectType;
  member: UserType;

  permission: "viewer" | "editor";
  project_id: string;
  user_id: string;
};

export type IconCategoriesType = "general" | "weather";

export type IconSelectMenuType = {
  // eslint-disable-next-line no-unused-vars
  setIcon: (newIcon: string) => void;
  close: () => void;
  iconTypes: IconCategoriesType[];
};

export type WebhookType = {
  id: string;
  title?: string;
  url: string;
  user_id: string;
};
