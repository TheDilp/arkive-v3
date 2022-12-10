import { Icon } from "@iconify/react";

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
