import { DocumentType } from "./documentTypes";
import { MapLayerType, MapType } from "./mapTypes";

export type TreeDataType = DocumentType | MapType;

export type SidebarTreeItemType = {
  data?: null | Partial<DocumentType | MapType | MapLayerType>;
  type: null | "documents" | "template" | "doc_folder" | "maps" | "map_folder" | "map_image" | "map_pin" | "map_layer";
};

export type SortIndexes = {
  id: string;
  parent: string | null;
  sort: number;
}[];
