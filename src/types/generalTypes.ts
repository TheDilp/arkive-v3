export type AvailableItemTypes = "documents" | "maps" | "boards" | "timelines";

export type IconSelectMenuType = {
  setIcon: (newIcon: string) => void;
  close: () => void;
};
