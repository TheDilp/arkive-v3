import { DocumentType } from "./documentTypes";
import { AvailableItemTypes } from "./generalTypes";
import { MapType } from "./mapTypes";

export type TreeDataType = DocumentType | MapType;

export type SidebarTreeItemType = {
  data?: null | Partial<DocumentType>;
  type: null | "document" | "template" | "doc_folder" | "map" | "map_folder" | "map_image";
};

export type SortIndexes = {
  id: string;
  parent: string | null;
  sort: number;
}[];

export type DialogAtomType = {
  id: null | string;
  type: null | AvailableItemTypes;
  position?: "left" | "right" | "top" | "bottom";
  modal?: boolean;
  fullscreen?: boolean;
  show: boolean;
};
