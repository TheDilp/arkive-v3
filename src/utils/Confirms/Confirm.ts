import { confirmDialog } from "primereact/confirmdialog";

export const deleteItem = (message: string, accept: () => void, reject?: () => void, acceptLabel?: string) => {
  confirmDialog({
    message,
    header: "Deleting item",
    icon: "pi pi-exclamation-triangle",
    acceptClassName: "p-button-danger p-button-outlined",
    rejectClassName: "p-button-info p-button-outlined",
    acceptIcon: "pi pi-trash",
    rejectIcon: "pi pi-times",
    acceptLabel: acceptLabel || "Yes",
    accept,
    reject,
  });
};
