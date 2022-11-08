const docItems = [
  {
    label: "Edit Document",
    icon: "pi pi-fw pi-pencil",
    command: () => {},
  },

  {
    label: "Change Type",
    icon: "pi pi-fw pi-sync",
    items: [
      {
        label: "Document",
        icon: "pi pi-fw pi-file",
        command: () => {},
      },
      {
        label: "Folder",
        icon: "pi pi-fw pi-folder",
        command: () => {},
      },
    ],
  },
  {
    label: "Covert to Template",
    icon: "pi pi-fw pi-copy",
    command: () => {},
  },
  {
    label: "Export JSON",
    icon: "pi pi-fw pi-download",
    command: () => {},
  },
  { separator: true },
  {
    label: "View Public Document",
    icon: "pi pi-fw pi-external-link",
    command: () => {},
  },
  {
    label: "Copy Public URL",
    icon: "pi pi-fw pi-link",
    command: () => {},
  },
  {
    label: "Delete Document",
    icon: "pi pi-fw pi-trash",
  },
];

export function contextMenuItems(
  cmType: "document" | "template" | "doc_folder" | null
) {
  if (cmType === "document") return docItems;
  if (cmType === "doc_folder") return [];
  if (cmType === "template") return [];
  return [];
}
