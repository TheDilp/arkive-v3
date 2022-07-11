// Default empty props for dialogs

export const docItemDisplayDialogDefault = {
  id: "",
  title: "",
  show: false,
  folder: false,
  depth: 0,
  template: false,
  parent: "",
};

export const NodeUpdateDialogDefault = {
  id: "",
  label: "",
  type: "rectangle",
  doc_id: undefined,
  width: 50,
  height: 50,
  fontSize: 16,
  customImage: { id: "", title: "", link: "", type: "Image" as const },
  textHAlign: "center" as const,
  textVAlign: "top" as const,
  backgroundColor: "#595959",
  backgroundOpacity: 1,
  zIndex: 1,
  show: false,
};
