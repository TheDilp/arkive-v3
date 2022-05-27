import { Sidebar } from "primereact/sidebar";
import React, { ReactNode, useContext } from "react";
import { SidebarContext } from "../Context/SidebarContext";

type Props = {
  children: ReactNode;
};

export default function TreeSidebar({ children }: Props) {
  const { sidebar, setSidebar } = useContext(SidebarContext);
  return (
    <Sidebar
      visible={sidebar}
      onHide={() => setSidebar(false)}
      className="treeSidebar surface-50"
    >
      {children}
    </Sidebar>
  );
}
