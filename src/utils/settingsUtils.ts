import { TagType } from "../types/generalTypes";

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
  { folder, template, isPublic }: { folder: boolean; template: boolean; isPublic: boolean },
  type: "folder" | "template" | "isPublic",
) {
  if (type === "folder") return folder;
  if (type === "template") return template;
  if (type === "isPublic") return isPublic;
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
