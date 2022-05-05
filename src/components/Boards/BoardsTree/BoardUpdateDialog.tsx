import { Dialog } from "primereact/dialog";
import React from "react";
import { boardItemDisplayDialog } from "../../../custom-types";

type Props = {
  visible: boardItemDisplayDialog;
  setVisible: (visible: boardItemDisplayDialog) => void;
};

export default function BoardUpdateDialog({ visible, setVisible }: Props) {
  return (
    <Dialog
      header={`Update Board ${visible.title}`}
      visible={visible.show}
      onHide={() =>
        setVisible({
          id: "",
          title: "",
          parent: "",
          folder: false,
          depth: 0,
          show: false,
        })
      }
    ></Dialog>
  );
}
