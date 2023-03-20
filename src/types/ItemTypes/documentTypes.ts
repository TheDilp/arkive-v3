import { RemirrorJSON } from "remirror";

import { BaseItemType } from "../generalTypes";

export interface AlterNameType {
  id: string;
  title: string;
}

export interface AlterNameCreateType extends AlterNameType {
  project_id: string;
  parentId: string;
}

export interface DocumentType extends BaseItemType {
  content: undefined | RemirrorJSON;
  icon: string;
  template: boolean;
  properties: undefined | string[];
  alter_names: AlterNameType[];
  image?: string | null;
  parent?: DocumentType;
}

export type DocumentCreateType = Partial<Omit<DocumentType, "project_id">> & {
  project_id: string;
};

export type DefaultDocumentType = Omit<DocumentType, "id" | "project_id" | "sort">;
