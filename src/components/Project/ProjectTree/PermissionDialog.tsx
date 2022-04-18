import React from "react";
import { PickList } from "primereact/picklist";
import { Dialog } from "primereact/dialog";
type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function PermissionDialog({ visible, setVisible }: Props) {
  return (
    <Dialog visible={visible} onHide={() => setVisible(false)}>
      PermissionDialog
    </Dialog>
  );
}
