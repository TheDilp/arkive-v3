import { Dispatch } from "react";
import { Sidebar as PrimeDrawer } from "primereact/sidebar";
import { SetStateAction, useAtom } from "jotai";
import { DrawerAtom } from "../../utils/atoms";
import DrawerDocumentContent from "./DrawerContent/DrawerDocumentContent";

export default function Drawer() {
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  return (
    <PrimeDrawer
      className="p-sidebar-sm"
      visible={drawer.id !== null}
      onHide={() => setDrawer({ id: null, type: null, drawerSize: "sm" })}>
      {drawer.type === "documents" ? <DrawerDocumentContent /> : null}
    </PrimeDrawer>
  );
}
