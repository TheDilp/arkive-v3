import { atom } from "jotai";
import { AvailableItemTypes } from "../types/generalTypes";
import { SidebarTreeItemType } from "../types/treeTypes";

export type DrawerAtomType = {
  id: null | string;
  type: null | AvailableItemTypes;
  drawerSize?: "sm" | "md" | "lg";
  position?: "left" | "right" | "top" | "bottom";
  fullscreen?: boolean;
};

export const SidebarTreeContextAtom = atom<SidebarTreeItemType>({
  data: null,
  type: null,
});

export const DrawerAtom = atom<DrawerAtomType>({
  id: null,
  type: null,
  drawerSize: "sm",
  position: "left",
});
