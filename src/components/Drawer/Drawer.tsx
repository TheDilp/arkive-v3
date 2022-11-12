import { Dispatch } from "react";
import { Sidebar as PrimeDrawer } from "primereact/sidebar";
import { SetStateAction } from "jotai";

type Props = {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
};

export default function Drawer({ visible, setVisible }: Props) {
  return (
    <PrimeDrawer className="p-sidebar-lg" visible={visible} onHide={() => setVisible(false)}>
      Drawer
    </PrimeDrawer>
  );
}
