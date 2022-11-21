import { RemirrorJSON } from "remirror";
import { DocumentType } from "./documentTypes";
import { MapType } from "./mapTypes";

export type AvailableItemTypes = "documents" | "maps" | "boards" | "timelines";

export type AllItemsType = DocumentType | MapType;

export type IconSelectMenuType = {
  setIcon: (newIcon: string) => void;
  close: () => void;
};

export type EditorType = {
  content?: RemirrorJSON | undefined;
  editable?: boolean;
};
export type BreadcrumbsType = { template: React.ReactNode }[];
