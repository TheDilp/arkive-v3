import { confirmDialog } from "primereact/confirmdialog";
export const deleteItem = (
  message: string,
  accept: () => void,
  reject?: () => void,
) => {
  confirmDialog({
    message,
    header: "Deleting item",
    icon: "pi pi-exclamation-triangle",
    accept,
    reject,
  });
};
