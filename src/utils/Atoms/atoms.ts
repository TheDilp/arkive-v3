import cytoscape from "cytoscape";
import { EdgeHandlesInstance } from "cytoscape-edgehandles";
import { atom } from "jotai";
import { DialogPositionType } from "primereact/dialog";

import { DrawerAtomType } from "../../types/drawerDialogTypes";
import { MapPinType, MapType } from "../../types/ItemTypes/mapTypes";
import { ProjectType } from "../../types/ItemTypes/projectTypes";
import { SidebarTreeItemType } from "../../types/treeTypes";
import { UserType } from "../../types/userTypes";
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
export const OtherContextMenuAtom = atom<{
  data: null | any;
  cm: any;
  show: boolean;
}>({
  data: null,
  cm: null,
  show: false,
});

const sidebarState = getItem("sidebarState") as boolean | undefined;

export const ThemeAtom = atom<"dark" | "light">("dark");
export const SidebarCollapseAtom = atom<boolean>(sidebarState ?? true);
export const ProjectAtom = atom<ProjectType | null>(null);
export const DrawerAtom = atom<DrawerAtomType>(DefaultDrawer);
export const DialogAtom = atom<DialogAtomType>(DefaultDialog);

export const MapContextAtom = atom<{ type: null | "map" | "pin"; data?: MapType | MapPinType }>({ type: null });
export const BoardReferenceAtom = atom<null | cytoscape.Core>(null);
export const BoardStateAtom = atom<{
  addNodes: boolean;
  grid: boolean;
  drawMode: boolean;
  curveStyle: "straight" | "taxi" | "unbundled-bezier";
}>({
  addNodes: false,
  grid: false,
  drawMode: false,
  curveStyle: "straight",
});
export const BoardEdgeHandlesAtom = atom<EdgeHandlesInstance | null>(null);
export const UserAtom = atom<(UserType & { permission: "owner" | "member" | null }) | null>(null);
export const DocumentsSidebar = atom<number>(0);
