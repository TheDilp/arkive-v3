import cytoscape from "cytoscape";
import { EdgeHandlesInstance } from "cytoscape-edgehandles";
import { atom } from "jotai";
import { DialogPositionType } from "primereact/dialog";

import { DrawerAtomType } from "../../types/drawerDialogTypes";
import { SidebarTreeItemType } from "../../types/treeTypes";
import { DefaultDialog, DefaultDrawer } from "../DefaultValues/DrawerDialogDefaults";
import { getItem } from "../storage";

export type DialogTypes =
  | null
  | "files"
  | "map_layer"
  | "editor_image"
  | "node_search"
  | "export_board"
  | "node_from_document"
  | "node_from_image";

export type DialogAtomType = {
  id: null | string;
  type: DialogTypes;
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
export const MentionContextAtom = atom<{
  data: null | any;
  cm: any;
  show: boolean;
}>({
  data: null,
  cm: null,
  show: false,
});

const sidebarState = getItem("sidebarState") as boolean | undefined;

export const SidebarCollapseAtom = atom<boolean>(sidebarState ?? true);

export const DrawerAtom = atom<DrawerAtomType>(DefaultDrawer);

export const DialogAtom = atom<DialogAtomType>(DefaultDialog);

export const MapContextAtom = atom<{ type: null | "map" | "pin" }>({ type: null });

export const BoardReferenceAtom = atom<null | cytoscape.Core>(null);

export const BoardStateAtom = atom<{
  grid: boolean;
  drawMode: boolean;
}>({
  grid: false,
  drawMode: false,
});

export const BoardEdgeHandlesAtom = atom<EdgeHandlesInstance | null>(null);
