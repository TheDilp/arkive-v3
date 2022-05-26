import { Sidebar } from "primereact/sidebar";
import React, { useContext } from "react";
import { SidebarContext } from "../Context/SidebarContext";

type Props = {
  children: JSX.Element | JSX.Element[];
};

export default function TreeSidebar({ children }: Props) {
  const { sidebar, setSidebar } = useContext(SidebarContext);
  return (
    <Sidebar
      visible={sidebar}
      onHide={() => setSidebar(false)}
      className="treeSidebar"
      modal={false}
    >
      {children}
    </Sidebar>
  );
}
