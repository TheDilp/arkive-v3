import { Core } from "cytoscape";

import { AllAvailableTypes, AvailableSearchResultTypes, SearchResultType } from "../types/generalTypes";
import { IconEnum } from "./DefaultValues/GeneralDefaults";

export function goToNodeEdge(subitem_id: string | undefined, id: string, boardRef: Core) {
  if (subitem_id === id) {
    const node = boardRef.getElementById(subitem_id);

    if (node)
      boardRef?.animate({
        center: {
          eles: node,
        },
      });
  }
}

export function getIconForFullSearch(item: SearchResultType) {
  if ("folder" in item && item.folder) return IconEnum.folder;
  let icon = IconEnum.document;
  if ("icon" in item) icon = item.icon || IconEnum.document;
  if ("text" in item) icon = IconEnum.map_pin;
  if ("label" in item) icon = IconEnum.board;
  if ("calendarsId" in item) icon = IconEnum.event;

  return icon;
}

export function getSearchGroupIcon(type: AvailableSearchResultTypes) {
  if (type === "documents") return IconEnum.document;
  if (type === "maps") return IconEnum.map;
  if (type === "pins") return IconEnum.map_pin;
  if (type === "boards" || type === "nodes" || type === "edges") return IconEnum.node;
  if (type === "screens") return IconEnum.screen;
  if (type === "sections") return IconEnum.section;
  if (type === "calendars") return IconEnum.calendar;
  if (type === "timelines") return IconEnum.timeline;
  if (type === "events") return IconEnum.event;

  return IconEnum.document;
}

export const searchCategories: { label: string; value: AllAvailableTypes; icon: string }[] = [
  {
    icon: IconEnum.document,
    label: "Documents",
    value: "documents",
  },
  {
    icon: IconEnum.map,
    label: "Maps",
    value: "maps",
  },
  {
    icon: IconEnum.map_pin,
    label: "Map pins",
    value: "map_pins",
  },
  {
    icon: IconEnum.board,
    label: "Graphs",
    value: "boards",
  },
  {
    icon: IconEnum.node,
    label: "Nodes",
    value: "nodes",
  },
  {
    icon: IconEnum.edge,
    label: "Edges",
    value: "edges",
  },
  {
    icon: IconEnum.calendar,
    label: "Calendars",
    value: "calendars",
  },
  {
    icon: IconEnum.timeline,
    label: "Timelines",
    value: "timelines",
  },
  {
    icon: IconEnum.event,
    label: "Events",
    value: "events",
  },
  {
    icon: IconEnum.screen,
    label: "Screens",
    value: "screens",
  },
  {
    icon: IconEnum.section,
    label: "Sections",
    value: "sections",
  },
  {
    icon: IconEnum.word,
    label: "Words",
    value: "words",
  },
];
