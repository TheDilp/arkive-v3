import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Sidebar as PrimeDrawer } from "primereact/sidebar";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DocumentDefaults";
import DrawerDocumentContent from "./DrawerContent/DrawerDocumentContent";

export default function Drawer() {
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  function handleClose() {
    setDrawer((prev) => ({ ...prev, show: false }));
    setTimeout(() => {
      setDrawer(DefaultDrawer);
    }, 500);
  }
  return (
    <PrimeDrawer
      className="p-sidebar-sm"
      dismissable={false}
      position={drawer.position}
      visible={drawer.show}
      onHide={handleClose}
      modal={false}
      showCloseIcon={false}
      icons={() => (
        <Button
          icon={
            <Icon
              className="pointer-events-none"
              icon="mdi:close"
              fontSize={26}
            />
          }
          className="p-0 w-fit p-button-text p-button-rounded p-button-secondary hover:bg-transparent"
          onClick={handleClose}
        />
      )}>
      {drawer.type === "documents" ? <DrawerDocumentContent /> : null}
    </PrimeDrawer>
  );
}
