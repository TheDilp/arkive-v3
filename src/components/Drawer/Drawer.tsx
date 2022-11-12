import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Sidebar as PrimeDrawer } from "primereact/sidebar";
import { DrawerAtom } from "../../utils/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DocumentDefaults";
import DrawerDocumentContent from "./DrawerContent/DrawerDocumentContent";

export default function Drawer() {
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  function handleClose() {
    setDrawer(DefaultDrawer);
  }
  return (
    <PrimeDrawer
      className="p-sidebar-sm"
      dismissable={false}
      visible={drawer.show}
      onHide={handleClose}
      showCloseIcon={false}
      icons={() => (
        <Button
          icon={
            <Icon
              className="pointer-events-none"
              icon="mdi:close"
              fontSize={26}
              onClick={handleClose}
            />
          }
          className="p-0 w-fit p-button-text p-button-rounded p-button-secondary hover:bg-transparent"
        />
      )}>
      {drawer.type === "documents" ? <DrawerDocumentContent /> : null}
    </PrimeDrawer>
  );
}
