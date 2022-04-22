import { Dialog } from "primereact/dialog";
import React from "react";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function DocFromTempDialog({ visible, setVisible }: Props) {
  return (
    <Dialog
      className="w-3"
      header={"Create Document From Template"}
      visible={visible}
      onHide={() => setVisible(false)}
    ></Dialog>
  );
}
