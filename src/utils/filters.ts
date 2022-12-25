import { AllItemsType } from "../types/generalTypes";

export function DropdownFilter(item: AllItemsType, existing?: AllItemsType) {
  if (!item.folder || (existing && item.id === existing.id)) return false;
  return true;
}
