import { DocumentType } from "./documentTypes";

export type TreeDataType = DocumentType;

export type SidebarTreeItemType = {
  id: null | string;
  type: null | "document" | "template" | "doc_folder";
};
