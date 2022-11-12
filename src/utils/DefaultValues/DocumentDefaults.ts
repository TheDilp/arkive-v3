import { DefaultDocumentType, DocumentType } from "../../types/documentTypes";

export const DefaultDocument: DefaultDocumentType = {
  title: "New Document",
  project_id: "",
  content: undefined,
  folder: false,
  template: false,
  public: false,
  expanded: false,
  categories: [],
  parent: undefined,
  properties: [],
  alter_names: [],
  icon: "mdi:file",
  sort: 0,
};
