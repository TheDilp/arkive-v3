import { RemirrorJSON } from "remirror";
import { DocumentType } from "./documentTypes";
import { MapPinType, MapType } from "./mapTypes";

export type AvailableItemTypes = "documents" | "maps" | "boards" | "timelines";
export type AvailableSubItemTypes = "map_pins";
export type AllAvailableTypes = AvailableItemTypes | AvailableSubItemTypes;

export type AllItemsType = DocumentType | MapType;
export type AllSubItemsType = MapPinType;

export type IconSelectMenuType = {
  setIcon: (newIcon: string) => void;
  close: () => void;
};

export type EditorType = {
  content?: RemirrorJSON | undefined;
  editable?: boolean;
};
export type BreadcrumbsType = { template: React.ReactNode }[];
