import cytoscape from "cytoscape";
import { EdgeHandlesInstance } from "cytoscape-edgehandles";
import { initializeApp } from "firebase/app";
import { atom } from "jotai";
import { DialogPositionType } from "primereact/dialog";

import { DrawerAtomType } from "../../types/drawerDialogTypes";
import { SidebarTreeItemType } from "../../types/treeTypes";
import { DefaultDialog, DefaultDrawer } from "../DefaultValues/DrawerDialogDefaults";

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

export const SidebarCollapseAtom = atom<boolean>(true);

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

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "the-arkive-v3.firebaseapp.com",
  projectId: "the-arkive-v3",
  storageBucket: "the-arkive-v3.appspot.com",
  messagingSenderId: "427542209724",
  appId: "1:427542209724:web:762016985ceab84cf49cb9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const FirebaseAtom = atom(app);
