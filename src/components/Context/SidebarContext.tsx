import { createContext, ReactNode, useState } from "react";

export const SidebarContext = createContext({
  sidebar: false,
  setSidebar: (sidebar: boolean) => {},
});

export default function SidebarProvider({ children }: { children: ReactNode }) {
  const [sidebar, setSidebar] = useState(false);

  return (
    <SidebarContext.Provider value={{ sidebar, setSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}
