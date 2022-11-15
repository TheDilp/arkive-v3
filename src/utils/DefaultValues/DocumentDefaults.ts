import { DefaultDocumentType } from "../../types/documentTypes";
import { DrawerAtomType } from "../Atoms/atoms";

export const DefaultDrawer: DrawerAtomType = {
  drawerSize: "sm",
  exceptions: {},
  fullscreen: false,
  id: null,
  modal: false,
  position: "left",
  show: false,
  type: null,
};

export const DefaultDocument: DefaultDocumentType = {
  alter_names: [],
  content: undefined,
  expanded: false,
  folder: false,
  icon: "mdi:file",
  parent: null,
  properties: [],
  public: false,
  sort: 0,
  tags: [],
  template: false,
  title: "New Document",
};
