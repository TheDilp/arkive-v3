import cytoscape, { EdgeDefinition, NodeDefinition } from "cytoscape";
import { atom } from "jotai";

import { DrawerAtomType } from "../../types/drawerDialogTypes";
import { MapPinType, MapType } from "../../types/ItemTypes/mapTypes";
import { PermissionType, ProjectType } from "../../types/ItemTypes/projectTypes";
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
  position?: "top" | "bottom" | "left" | "right" | "top-right" | "top-left" | "bottom-left" | "bottom-right" | "center";
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

export const NodesAtom = atom<NodeDefinition[]>([]);
export const EdgesAtom = atom<EdgeDefinition[]>([]);

export const UserAtom = atom<UserType | null>(null);

export const PermissionAtom = atom<PermissionType | "owner" | null>((get) => {
  const projectData = get(ProjectAtom);
  const userData = get(UserAtom);
  if (projectData?.owner_id === userData?.id) return "owner";

  // if (projectData && userData) {
  //   if (projectData.ownerId === userData.auth_id) return "owner";

  //   return projectData.members.find((member) => member.member.id === userData.id)?.permissions[0] ?? null;
  // }

  return null;
});
export const PendingUpdatesAtom = atom<boolean>(false);

// Atom for documents or templates tab
export const DocumentsSidebar = atom<number>(0);
