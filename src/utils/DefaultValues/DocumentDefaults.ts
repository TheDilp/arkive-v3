import { DefaultDocumentType } from "../../types/ItemTypes/documentTypes";
import { IconEnum } from "./GeneralDefaults";

export const DefaultDocument: DefaultDocumentType = {
  alter_names: [],
  content: undefined,
  expanded: false,
  folder: false,
  icon: IconEnum.document,
  parentId: null,
  properties: [],
  isPublic: false,
  tags: [],
  template: false,
  title: "New Document",
};
