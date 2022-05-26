import { createContext, useState } from "react";

export const SidebarContext = createContext({
  sidebar: false,
  setSidebar: (sidebar: boolean) => {},
});

export default function SidebarProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const [sidebar, setSidebar] = useState(false);

  return (
    <SidebarContext.Provider value={{ sidebar, setSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}
