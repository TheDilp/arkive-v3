import { atom } from "jotai";
import { AvailableItemTypes } from "../types/generalTypes";
import { SidebarTreeItemType } from "../types/treeTypes";

export const SidebarTreeContextAtom = atom<SidebarTreeItemType>({
  data: null,
  type: null,
});

export const DrawerAtom = atom<{
  id: null | string;
  type: null | AvailableItemTypes;
  drawerSize: "sm" | "md" | "lg";
}>({ id: null, type: null, drawerSize: "sm" });
