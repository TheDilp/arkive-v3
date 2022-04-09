import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Document } from "../../../custom-types";
type Props = {
  displayDialog: Document | boolean;
  setDisplayDialog: (displayDialog: Document | boolean) => void;
};

export default function ProjectTreeDialog({
  displayDialog,
  setDisplayDialog,
}: Props) {
  return (
    <Dialog
      header="Header"
      visible={displayDialog !== false}
      style={{ width: "50vw" }}
      onHide={() => setDisplayDialog(false)}
      modal={false}
    >
      asdasdasd
    </Dialog>
  );
}
