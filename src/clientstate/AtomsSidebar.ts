import { atom, useAtom } from "jotai";
import { MenuItem } from "primereact/menuitem";
import { SidebarTreeItemType } from "../types/treeTypes";

export const documentTreeContextAtom = atom<SidebarTreeItemType>({
  id: null,
  type: null,
});
