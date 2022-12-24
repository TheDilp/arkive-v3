import { confirmDialog } from "primereact/confirmdialog";

export const deleteItem = (message: string, accept: () => void, reject?: () => void) => {
  confirmDialog({
    message,
    header: "Deleting item",
    icon: "pi pi-exclamation-triangle",
    acceptClassName: "p-button-danger p-button-outlined",
    rejectClassName: "p-button-info p-button-outlined",
    accept,
    reject,
  });
};
