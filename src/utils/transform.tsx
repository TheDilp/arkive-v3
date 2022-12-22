import { Icon } from "@iconify/react";

import { BoardType, NodeType } from "../types/boardTypes";
import { DocumentType } from "../types/documentTypes";
import { AllItemsType, AvailableItemTypes, AvailableSearchResultTypes } from "../types/generalTypes";
import { MapPinType, MapType } from "../types/mapTypes";

export const buttonLabelWithIcon = (title: string, icon: string, size?: number) => (
  <div className="flex w-full items-center justify-center gap-x-1">
    <div className="ml-4 text-center">{title}</div>
    <Icon className="ml-auto" fontSize={size || 20} icon={icon} />
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
  if (type === "nodes") return `/project/${project_id}/boards/${parent}/${id}`;
  return "./";
}

export function getIconForFullSearch(item: DocumentType | MapType | MapPinType | BoardType | NodeType) {
  let icon = "mdi:file";
  if ("icon" in item) icon = item.icon || "mdi:file";
  if ("text" in item) icon = "mdi:map_marker";
  if ("label" in item) icon = "mdi:cog";

  return icon;
}
