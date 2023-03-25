import { saveAs } from "file-saver";
import JSZip from "jszip";
import { TagType } from "../types/generalTypes";
import { ProjectType } from "../types/ItemTypes/projectTypes";

export function tagsFilterFunction(value: TagType[], filter: TagType[] | null) {
  if (!filter || !value) return true;
  if (filter.every((f) => value.some((v) => v.id === f.id))) {
    return true;
  }
  return false;
}
export function defaultNodeFilterFunction(value: string, filter: string[] | null) {
  if (!filter || !value) return true;
  if (filter.some((f) => value === f)) {
    return true;
  }
  return false;
}

export function getCheckedValue(
  { folder, template, isPublic }: { folder: boolean; template?: boolean; isPublic: boolean },
  type: "folder" | "template" | "isPublic",
) {
  if (type === "folder") return folder;
  if (type === "isPublic") return isPublic;
  if (type === "template") return template;
  return false;
}

export const userPermissions = [
  // {
  //   label: "Viewer",
  //   value: "viewer",
  // },
  {
    label: "Editor",
    value: "editor",
  },
];

export function exportProject(project: ProjectType) {
  const data = new Blob([JSON.stringify(project)], { type: "text/plain;charset=utf-8" });
  saveAs(data, `${project.id}.json`);
}
