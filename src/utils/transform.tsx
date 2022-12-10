import { Icon } from "@iconify/react";

import { AllItemsType, AvailableItemTypes } from "../types/generalTypes";

export const buttonLabelWithIcon = (title: string, icon: string, size?: number) => (
  <div className="flex items-center gap-x-1">
    <span>{title}</span>
    <Icon fontSize={size || 20} icon={icon} />
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
