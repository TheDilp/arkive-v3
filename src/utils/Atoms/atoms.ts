import { atom } from "jotai";
import { DialogPositionType } from "primereact/dialog";
import { DrawerAtomType } from "../../types/drawerDialogTypes";
import { AvailableItemTypes } from "../../types/generalTypes";
import { SidebarTreeItemType } from "../../types/treeTypes";
import { DefaultDialog, DefaultDrawer } from "../DefaultValues/DrawerDialogDefaults";

export type DialogAtomType = {
  id: null | string;
  type: null | "files" | "map_marker";
  position?: DialogPositionType;
  modal?: boolean;
  fullscreen?: boolean;
  show: boolean;
};

export const SidebarTreeContextAtom = atom<SidebarTreeItemType>({
  data: null,
  type: null,
});

export const DrawerAtom = atom<DrawerAtomType>(DefaultDrawer);

export const DialogAtom = atom<DialogAtomType>(DefaultDialog);
