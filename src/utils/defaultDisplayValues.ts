// Default empty props for dialogs

export const docItemDisplayDialogDefault = {
  id: "",
  title: "",
  show: false,
  folder: false,
  depth: 0,
  template: false,
  parent: "",
  expanded: false,
  public: false,
  type: "Document" as const,
};

export const mapItemDisplayDialogDefault = {
  id: "",
  title: "",
  map_image: { id: "", title: "", link: "", type: "Image" as const },
  parent: "",
  show: false,
  folder: false,
  depth: 0,
  public: false,
  expanded: false,
  type: "Map" as const,
};
export const boardItemDisplayDialogDefault = {
  id: "",
  title: "",
  parent: "",
  show: false,
  folder: false,
  depth: 0,
  public: false,
  expanded: false,
  type: "Board" as const,
};
