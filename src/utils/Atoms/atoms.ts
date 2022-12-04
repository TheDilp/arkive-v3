import { atom } from "jotai";
import { DialogPositionType } from "primereact/dialog";

import { DrawerAtomType } from "../../types/drawerDialogTypes";
import { SidebarTreeItemType } from "../../types/treeTypes";
import { DefaultDialog, DefaultDrawer } from "../DefaultValues/DrawerDialogDefaults";

export type DialogAtomType = {
  id: null | string;
  type: null | "files" | "map_layer";
  position?: DialogPositionType;
  modal?: boolean;
  fullscreen?: boolean;
  show: boolean;
  data?: null | {
    [key: string]: any;
  };
};

export const SidebarTreeContextAtom = atom<SidebarTreeItemType>({
  data: null,
  type: null,
  folder: false,
  template: false,
});

export const DrawerAtom = atom<DrawerAtomType>(DefaultDrawer);

export const DialogAtom = atom<DialogAtomType>(DefaultDialog);

export const MapContextAtom = atom<{ type: null | "map" | "pin" }>({ type: null });
