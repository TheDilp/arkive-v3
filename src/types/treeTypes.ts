import { DocumentType } from "./documentTypes";

export type TreeDataType = DocumentType;

export type SidebarTreeItemType = {
  data?: null | Partial<DocumentType>;
  type: null | "document" | "template" | "doc_folder";
};

export type SortIndexes = {
  id: string;
  parent: string | null;
  sort: number;
}[];
