import { TagType } from "../types/generalTypes";

export function tagsFilterFunction(value: TagType[], filter: TagType[] | null) {
  if (!filter || !value) return true;
  if (filter.every((f) => value.some((v) => v.id === f.id))) {
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
