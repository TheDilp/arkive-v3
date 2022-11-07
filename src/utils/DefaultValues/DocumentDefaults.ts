import { DocumentType } from "../../types/documentTypes";

export const DefaultDocument: Omit<DocumentType, "id" | "project_id"> = {
  title: "New Document",
  content: null,
  folder: false,
  template: false,
  public: false,
  expanded: false,
  categories: [],
  parent: null,
  alter_names: [],
  icon: "mdi:file",
  sort: 0,
};
