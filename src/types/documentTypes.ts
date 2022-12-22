import { RemirrorJSON } from "remirror";

import { BaseItemType } from "./generalTypes";

export interface DocumentType extends BaseItemType {
  content: undefined | RemirrorJSON;
  icon: string;
  template: boolean;
  properties: undefined | string[];
  alter_names: string[];
  image?: string | null;
}

export type DocumentCreateType = Partial<Omit<DocumentType, "project_id">> & {
  project_id: string;
};

export type DefaultDocumentType = Omit<DocumentType, "id" | "project_id">;
