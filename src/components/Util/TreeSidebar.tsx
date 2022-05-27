import { Sidebar } from "primereact/sidebar";
import React, { ReactNode, useContext } from "react";
import { MediaQueryContext } from "../Context/MediaQueryContext";
import { SidebarContext } from "../Context/SidebarContext";

type Props = {
  children: ReactNode;
};

export default function TreeSidebar({ children }: Props) {
  const { sidebar, setSidebar } = useContext(SidebarContext);
  const { isTabletOrMobile } = useContext(MediaQueryContext);
  return isTabletOrMobile ? (
    <Sidebar
      visible={sidebar}
      onHide={() => setSidebar(false)}
      className="treeSidebar surface-50"
    >
      {children}
    </Sidebar>
  ) : (
    <>{children}</>
  );
}
