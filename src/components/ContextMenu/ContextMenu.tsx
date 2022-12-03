import { ContextMenu as PrimeContextMenu } from "primereact/contextmenu";
import { MenuItem } from "primereact/menuitem";
import { MutableRefObject } from "react";

type Props = {
  items: MenuItem[];
  cm: MutableRefObject<any>;
};

export default function ContextMenu({ items, cm }: Props) {
  return items ? <PrimeContextMenu ref={cm} model={items} /> : null;
}
