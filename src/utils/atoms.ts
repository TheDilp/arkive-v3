import { atom } from "jotai";
import { SidebarTreeItemType } from "../types/treeTypes";

export const SidebarTreeContextAtom = atom<SidebarTreeItemType>({
  id: null,
  type: null,
});

export const DialogAtom = atom<{
  id: null | string;
  type: null | "documents" | "maps" | "boards" | "timelines";
}>({ id: null, type: null });
