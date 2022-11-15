import { atom } from "jotai";
import { AvailableItemTypes } from "../../types/generalTypes";
import { SidebarTreeItemType } from "../../types/treeTypes";
import { DefaultDrawer } from "../DefaultValues/DocumentDefaults";

export type DrawerAtomType = {
  id: null | string;
  type: null | AvailableItemTypes;
  drawerSize?: "sm" | "md" | "lg";
  position?: "left" | "right" | "top" | "bottom";
  modal?: boolean;
  fullscreen?: boolean;
  exceptions: {
    fromTemplate?: boolean;
    createTemplate?: boolean;
  };
  show: boolean;
};

export const SidebarTreeContextAtom = atom<SidebarTreeItemType>({
  data: null,
  type: null,
});

export const DrawerAtom = atom<DrawerAtomType>(DefaultDrawer);
