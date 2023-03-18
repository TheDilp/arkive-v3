import { Icon } from "@iconify/react";
import { ColorPickerValueType } from "primereact/colorpicker";

import { AllItemsType, AvailableItemTypes, AvailableSearchResultTypes } from "../types/generalTypes";
import { IconEnum } from "./DefaultValues/GeneralDefaults";

export const buttonLabelWithIcon = (title: string, icon: string, size?: number) => (
  <div className="flex min-h-full w-full items-center justify-center gap-x-1">
    <div className="ml-0 text-center">{title}</div>
    <Icon className="" fontSize={size || 20} icon={icon} />
  </div>
);

export function getItemNameForTree(type: AvailableItemTypes) {
  if (type) {
    if (type === "randomtables") return "random table";
    if (type === "boards") return "graph";
    if (type !== "dictionaries") return type.slice(0, type.length - 1);
    return "dictionary";
  }
  return "";
}
export function getItemIcon(type: AvailableItemTypes) {
  if (type === "documents") return IconEnum.document;
  if (type === "maps") return IconEnum.map;
  if (type === "boards") return IconEnum.board;
  if (type === "screens") return IconEnum.screen;
  if (type === "dictionaries") return IconEnum.dictionary;
  if (type === "calendars") return IconEnum.calendar;
  if (type === "timelines") return IconEnum.timeline;
  if (type === "randomtables") return IconEnum.randomtables;
  return IconEnum.add;
}
export function getIcon(type: AvailableItemTypes, item: AllItemsType) {
  if ("icon" in item) return item.icon;
  if (type === "maps") return IconEnum.map;
  if (type === "boards") return IconEnum.board;
  return IconEnum.document;
}

export function getLinkForFullSearch(
  id: string,
  parentId: string,
  type: AvailableSearchResultTypes | "folder",
  project_id: string,
  folder: boolean,
) {
  if (["documents", "maps", "boards", "screens", "timelines", "calendars"].includes(type))
    return `/project/${project_id}/${type}/${folder ? "folder/" : ""}${id}`;
  if (type === "pins") return `/project/${project_id}/maps/${parentId}/${id}`;
  if (type === "nodes" || type === "edges") return `/project/${project_id}/boards/${parentId}/${id}`;
  if (type === "sections") return `/project/${project_id}/screens/${parentId}/${id}`;
  if (type === "events") return `/project/${project_id}/calendars/${parentId}/${id}`;
  return "./";
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
export function formatImageURL(image: string) {
  return image.replaceAll(" ", "%20");
}
