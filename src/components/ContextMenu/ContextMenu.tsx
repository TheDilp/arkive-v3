import { MutableRefObject } from "react";
import { ContextMenu as PrimeContextMenu } from "primereact/contextmenu";
import { MenuItem } from "primereact/menuitem";
import { SidebarTreeItemType } from "../../types/treeTypes";

type Props = {
  items: MenuItem[];
  cm: MutableRefObject<any>;
};

export default function ContextMenu({ items, cm }: Props) {
  return items ? <PrimeContextMenu model={items} ref={cm}></PrimeContextMenu> : null;
}
