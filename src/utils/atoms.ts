import { atom } from "jotai";
import { AvailableItemTypes } from "../types/generalTypes";
import { SidebarTreeItemType } from "../types/treeTypes";

export const SidebarTreeContextAtom = atom<SidebarTreeItemType>({
  id: null,
  type: null,
});

export const DialogAtom = atom<{
  id: null | string;
  type: null | AvailableItemTypes;
}>({ id: null, type: null });
