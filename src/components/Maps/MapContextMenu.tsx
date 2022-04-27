import React from "react";
import { ContextMenu } from "primereact/contextmenu";
type Props = { cm: any };

export default function MapContextMenu({ cm }: Props) {
  const items = [
    {
      label: "New Token",
      icon: "pi pi-fw pi-bookmark-fill",
    },
  ];
  return <ContextMenu model={items} ref={cm} />;
}
