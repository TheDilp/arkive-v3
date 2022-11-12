import { RemirrorJSON } from "remirror";

export type DocumentType = {
  id: string;
  project_id: string;
  title: string;
  content: undefined | RemirrorJSON;
  categories: string[];
  icon: string;
  parent: string | undefined;
  expanded: boolean;
  folder: boolean;
  public: boolean;
  template: boolean;
  sort: number;
  properties: undefined | string[];
  alter_names: string[];
};

export type DocumentCreateType = Partial<Omit<DocumentType, "project_id">> & {
  project_id: string;
};

export type DefaultDocumentType = Omit<DocumentType, "id">;
