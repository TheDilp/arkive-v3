import { Icon } from "@iconify/react";
import { ColorPickerValueType } from "primereact/colorpicker";

import { BoardType, EdgeType, NodeType } from "../types/boardTypes";
import { DocumentType } from "../types/documentTypes";
import { AllItemsType, AvailableItemTypes, AvailableSearchResultTypes } from "../types/generalTypes";
import { MapPinType, MapType } from "../types/mapTypes";

export const buttonLabelWithIcon = (title: string, icon: string, size?: number) => (
  <div className="flex w-full items-center justify-center gap-x-1">
    <div className="ml-0 text-center">{title}</div>
    <Icon className="" fontSize={size || 20} icon={icon} />
  </div>
);

export function getType(pathname: string) {
  if (pathname.includes("documents")) return "documents";
  if (pathname.includes("maps")) return "maps";
  if (pathname.includes("boards")) return "boards";
  if (pathname.includes("timelines")) return "timelines";
  return "documents";
}
export function getIcon(type: AvailableItemTypes, item: AllItemsType) {
  if ("icon" in item) return item.icon;
  if (type === "maps") return "mdi:map";
  if (type === "boards") return "mdi:draw";
  return "mdi:file";
}

export function getLinkForFullSearch(id: string, parent: string, type: AvailableSearchResultTypes, project_id: string) {
  if (["documents", "maps", "boards"].includes(type)) return `/project/${project_id}/${type}/${id}`;
  if (type === "pins") return `/project/${project_id}/maps/${parent}/${id}`;
  if (type === "nodes" || type === "edges") return `/project/${project_id}/boards/${parent}/${id}`;
  return "./";
}

export function getIconForFullSearch(item: DocumentType | MapType | MapPinType | BoardType | NodeType | EdgeType) {
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
      return keys.includes(key) ? previousValue : { ...previousValue, [key]: removeKeys(obj[key], keys) };
    }, {});
  }

  return obj;
}
