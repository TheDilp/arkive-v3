import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Sidebar as PrimeDrawer } from "primereact/sidebar";
import { SetStateAction } from "react";
import { DrawerAtom, DrawerAtomType } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DocumentDefaults";
import DrawerDocumentContent from "./DrawerContent/DrawerDocumentContent";

export default function Drawer() {
  const [drawer, setDrawer] = useAtom(DrawerAtom);

  return (
    <PrimeDrawer
      className="p-sidebar-sm"
      dismissable={false}
      position={drawer.position}
      visible={drawer.show}
      onHide={() => handleCloseDrawer(setDrawer)}
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
          onClick={() => handleCloseDrawer(setDrawer)}
        />
      )}>
      {drawer.type === "documents" ? <DrawerDocumentContent /> : null}
    </PrimeDrawer>
  );
}

export function handleCloseDrawer(
  setDrawer: (update: SetStateAction<DrawerAtomType>) => void,
) {
  setDrawer((prev) => ({ ...prev, show: false }));
  setTimeout(() => {
    setDrawer(DefaultDrawer);
  }, 500);
}
