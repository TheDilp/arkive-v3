import { Icon } from "@iconify/react";
import { ColorPickerValueType } from "primereact/colorpicker";

import { AllItemsType, AvailableItemTypes, AvailableSearchResultTypes } from "../types/generalTypes";
import { BoardType, EdgeType, NodeType } from "../types/ItemTypes/boardTypes";
import { DocumentType } from "../types/ItemTypes/documentTypes";
import { MapPinType, MapType } from "../types/ItemTypes/mapTypes";
import { ScreenType, SectionType } from "../types/ItemTypes/screenTypes";

export const buttonLabelWithIcon = (title: string, icon: string, size?: number) => (
  <div className="flex w-full items-center justify-center gap-x-1">
    <div className="ml-0 text-center">{title}</div>
    <Icon className="" fontSize={size || 20} icon={icon} />
  </div>
);

export function getItemTypeFromURL(pathname: string) {
  if (pathname.includes("documents")) return "documents";
  if (pathname.includes("maps")) return "maps";
  if (pathname.includes("boards")) return "boards";
  if (pathname.includes("screens")) return "screens";
  if (pathname.includes("dictionaries")) return "dictionaries";
  if (pathname.includes("calendars")) return "calendars";
  return "documents";
}
export function getItemNameForTree(type: AvailableItemTypes) {
  if (type !== "dictionaries") return type.slice(0, type.length - 1);
  return "dictionary";
}
export function getItemIconForTree(type: AvailableItemTypes) {
  if (type === "documents") return "mdi:file";
  if (type === "maps") return "mdi:map-outline";
  if (type === "boards") return "ph:graph";
  if (type === "screens") return "fluent:board-24-regular";
  if (type === "dictionaries") return "mdi-light:book";
  if (type === "calendars") return "ph:calendar-blank";
  if (type === "randomtables") return "arcticons:reroll";
  return "mdi:plus";
}
export function getIcon(type: AvailableItemTypes, item: AllItemsType) {
  if ("icon" in item) return item.icon;
  if (type === "maps") return "mdi:map";
  if (type === "boards") return "mdi:draw";
  return "mdi:file";
}

export function getLinkForFullSearch(
  id: string,
  parentId: string,
  type: AvailableSearchResultTypes | "folder",
  project_id: string,
  folder: boolean,
) {
  if (["documents", "maps", "boards", "screens"].includes(type))
    return `/project/${project_id}/${type}/${folder ? "folder/" : ""}${id}`;
  if (type === "pins") return `/project/${project_id}/maps/${parentId}/${id}`;
  if (type === "nodes" || type === "edges") return `/project/${project_id}/boards/${parentId}/${id}`;
  if (type === "sections") return `/project/${project_id}/screens/${parentId}/${id}`;
  return "./";
}

export function getIconForFullSearch(
  item: DocumentType | MapType | MapPinType | BoardType | NodeType | EdgeType | ScreenType | SectionType,
) {
  if ("folder" in item && item.folder) return "mdi:folder";
  let icon = "mdi:file";
  if ("icon" in item) icon = item.icon || "mdi:file";
  if ("text" in item) icon = "mdi:map_marker";
  if ("label" in item) icon = "ph:graph-light";

  return icon;
}

export function getHexColor(value: string | ColorPickerValueType) {
  return `#${value?.toString().replaceAll("#", "")}`;
}

export function removeKeys(obj: { [key: string]: any }, keys: string[]): object {
  if (Array.isArray(obj)) return obj.map((item) => removeKeys(item, keys));

  if (typeof obj === "object" && obj !== null) {
    return Object.keys(obj).reduce((previousValue, key) => {
      return keys.includes(key) ? previousValue : { ...previousValue, [key.toLowerCase()]: removeKeys(obj[key], keys) };
    }, {});
  }
  return obj;
}
