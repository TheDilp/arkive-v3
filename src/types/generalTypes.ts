import { RemirrorJSON } from "remirror";

export type AvailableItemTypes = "documents" | "maps" | "boards" | "timelines";

export type IconSelectMenuType = {
  setIcon: (newIcon: string) => void;
  close: () => void;
};

export type EditorType = {
  content?: RemirrorJSON | undefined;
  editable?: boolean;
};
