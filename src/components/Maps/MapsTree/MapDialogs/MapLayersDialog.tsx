import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<{ map_id: string; show: boolean }>>;
};

export default function MapLayersDialog({ visible, setVisible }: Props) {
  return (
    <Dialog
      visible={visible}
      onHide={() => setVisible({ map_id: "", show: false })}
    >
      MapLayersDialog
    </Dialog>
  );
}
