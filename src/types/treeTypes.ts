import { DocumentType } from "./documentTypes";
import { MapType } from "./mapTypes";

export type TreeDataType = DocumentType | MapType;

export type SidebarTreeItemType = {
  data?: null | Partial<DocumentType>;
  type: null | "document" | "template" | "doc_folder";
};

export type SortIndexes = {
  id: string;
  parent: string | null;
  sort: number;
}[];
