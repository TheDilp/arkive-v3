import { atom, useAtom } from "jotai";
import { MenuItem } from "primereact/menuitem";

export const documentTreeContextAtom = atom<
  null | "document" | "template" | "doc_folder"
>(null);
