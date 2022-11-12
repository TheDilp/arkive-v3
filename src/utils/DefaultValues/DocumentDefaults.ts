import { DefaultDocumentType } from "../../types/documentTypes";
import { DrawerAtomType } from "../atoms";

export const DefaultDrawer: DrawerAtomType = {
  id: null,
  type: null,
  drawerSize: "sm",
  position: "left",
  fullscreen: false,
  show: false,
};

export const DefaultDocument: DefaultDocumentType = {
  title: "New Document",
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
