import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Sidebar as PrimeDrawer } from "primereact/sidebar";
import { Dispatch, SetStateAction } from "react";

import { DrawerAtomType } from "../../types/drawerDialogTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import DrawerBoardContent from "./DrawerContent/DrawerBoardContent";
import DrawerDocumentContent from "./DrawerContent/DrawerDocumentContent";
import DrawerEdgeContent from "./DrawerContent/DrawerEdgeContent";
import DrawerFromTemplateContent from "./DrawerContent/DrawerFromTemplateContent";
import DrawerFullSearch from "./DrawerContent/DrawerFullSearch";
import DrawerMapContent from "./DrawerContent/DrawerMapContent";
import DrawerMapPinContent from "./DrawerContent/DrawerMapPinContent";
import DrawerNodeContent from "./DrawerContent/DrawerNodeContent";

export function handleCloseDrawer(setDrawer: Dispatch<SetStateAction<DrawerAtomType>>) {
  setDrawer((prev) => ({ ...prev, show: false }));
  setTimeout(() => {
    setDrawer(DefaultDrawer);
  }, 500);
}

// eslint-disable-next-line no-unused-vars
function DrawerIcons(setDrawer: (update: SetStateAction<DrawerAtomType>) => void) {
  return (
    <Button
      className="p-button-text p-button-rounded p-button-secondary w-fit p-0 hover:bg-transparent"
      icon={<Icon className="pointer-events-none" fontSize={26} icon="mdi:close" />}
      onClick={() => handleCloseDrawer(setDrawer)}
    />
  );
}

export default function Drawer() {
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  return (
    <PrimeDrawer
      className={`p-sidebar-${drawer.drawerSize || "sm"} max-h-full overflow-y-auto`}
      dismissable={false}
      icons={() => DrawerIcons(setDrawer)}
      modal={false}
      onHide={() => handleCloseDrawer(setDrawer)}
      position={drawer.position}
      showCloseIcon={false}
      visible={drawer.show}>
      {drawer.type === "documents" && !drawer.exceptions?.fromTemplate ? <DrawerDocumentContent /> : null}
      {drawer.type === "documents" && drawer.exceptions?.fromTemplate ? <DrawerFromTemplateContent /> : null}
      {drawer.type === "maps" ? <DrawerMapContent /> : null}
      {drawer.type === "map_pins" ? <DrawerMapPinContent /> : null}
      {drawer.type === "boards" ? <DrawerBoardContent /> : null}
      {drawer.type === "nodes" ? <DrawerNodeContent /> : null}
      {drawer.type === "edges" ? <DrawerEdgeContent /> : null}
      {drawer.type === "full_search" ? <DrawerFullSearch /> : null}
    </PrimeDrawer>
  );
}
