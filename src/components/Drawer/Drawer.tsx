import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Sidebar as PrimeDrawer } from "primereact/sidebar";
import { Dispatch, lazy, SetStateAction } from "react";

import { DrawerAtomType } from "../../types/drawerDialogTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";

const DrawerBoardContent = lazy(() => import("./DrawerContent/DrawerBoardContent"));
const DrawerBulkBoardEdit = lazy(() => import("./DrawerContent/DrawerBulkBoardEdit"));
const DrawerCardContent = lazy(() => import("./DrawerContent/DrawerCardContent"));
const DrawerDictionaryContent = lazy(() => import("./DrawerContent/DrawerDictionaryContent"));
const DrawerDocumentContent = lazy(() => import("./DrawerContent/DrawerDocumentContent"));
const DrawerEdgeContent = lazy(() => import("./DrawerContent/DrawerEdgeContent"));
const DrawerFromTemplateContent = lazy(() => import("./DrawerContent/DrawerFromTemplateContent"));
const DrawerFullSearch = lazy(() => import("./DrawerContent/DrawerFullSearch"));
const DrawerMapContent = lazy(() => import("./DrawerContent/DrawerMapContent"));
const DrawerMapPinContent = lazy(() => import("./DrawerContent/DrawerMapPinContent"));
const DrawerMentionContent = lazy(() => import("./DrawerContent/DrawerMentionContent"));
const DrawerNodeContent = lazy(() => import("./DrawerContent/DrawerNodeContent"));
const DrawerScreensContent = lazy(() => import("./DrawerContent/DrawerScreensContent"));
const DrawerSectionContent = lazy(() => import("./DrawerContent/DrawerSectionContent"));

export function handleCloseDrawer(
  setDrawer: Dispatch<SetStateAction<DrawerAtomType>>,
  position?: "left" | "right" | "top" | "bottom",
) {
  setDrawer((prev) => ({ ...prev, position: position || prev.position, show: false }));
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
      {drawer.type === "many_nodes" || drawer.type === "many_edges" ? <DrawerBulkBoardEdit /> : null}
      {drawer.type === "full_search" ? <DrawerFullSearch /> : null}
      {drawer.type === "mention" ? <DrawerMentionContent /> : null}
      {drawer.type === "screens" ? <DrawerScreensContent /> : null}
      {drawer.type === "sections" ? <DrawerSectionContent /> : null}
      {drawer.type === "dictionaries" ? <DrawerDictionaryContent /> : null}
      {drawer.type === "cards" ? <DrawerCardContent /> : null}
    </PrimeDrawer>
  );
}
