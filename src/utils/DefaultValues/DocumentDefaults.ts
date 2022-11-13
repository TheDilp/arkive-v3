import { DefaultDocumentType } from "../../types/documentTypes";
import { DrawerAtomType } from "../Atoms/atoms";

export const DefaultDrawer: DrawerAtomType = {
  id: null,
  type: null,
  drawerSize: "sm",
  position: "left",
  fullscreen: false,
  templates: false,
  modal: false,
  show: false,
};

export const DefaultDocument: DefaultDocumentType = {
  title: "New Document",
  content: undefined,
  folder: false,
  template: false,
  public: false,
  expanded: false,
  tags: [],
  parent: null,
  properties: [],
  alter_names: [],
  icon: "mdi:file",
  sort: 0,
};

export const DefaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "",
        },
      ],
    },
  ],
};
