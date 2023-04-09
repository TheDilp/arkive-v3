import { useAtom, useAtomValue } from "jotai";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";
import { TabPanel, TabView } from "primereact/tabview";
import { useLocation, useParams } from "react-router-dom";

import { useBreakpoint } from "../../hooks/useMediaQuery";
import { AvailableItemTypes } from "../../types/generalTypes";
import { DocumentsSidebar, SidebarCollapseAtom, ThemeAtom } from "../../utils/Atoms/atoms";
import { setItem } from "../../utils/storage";
import DocumentsTree from "../Tree/DocumentsTree";
import ItemsTree from "../Tree/ItemsTree";
import TemplatesTree from "../Tree/TemplatesTree";
import SettingsSidebar from "./SecondarySidebarContent/SettingsSidebar";

type Props = {
  children: JSX.Element | null;
};
function SidebarContainer({ children }: Props) {
  const { isLg } = useBreakpoint();
  const [sidebar, setSidebar] = useAtom(SidebarCollapseAtom);
  const theme = useAtomValue(ThemeAtom);
  return !isLg ? (
    <PrimeSidebar
      className={`treeSidebar ${theme === "dark" ? "bg-zinc-800" : "bg-white"} transition-all`}
      onHide={() => {
        setSidebar(false);
        setItem("sidebarState", false);
      }}
      visible={sidebar}>
      {children}
    </PrimeSidebar>
  ) : (
    <div
      className={`flex ${sidebar ? "flex-1 opacity-100" : "w-0 max-w-0 overflow-hidden opacity-0"} max-w-[20rem] flex-col ${
        theme === "dark" ? "bg-zinc-900" : "bg-white"
      } transition-all`}>
      {children}
    </div>
  );
}

function SidebarContent() {
  const { type } = useParams();
  const { pathname } = useLocation();
  const [documentsTab, setDocumentsTab] = useAtom(DocumentsSidebar);
  if (pathname.includes("settings")) return <SettingsSidebar />;

  if (type === "documents")
    return (
      <div className="flex flex-1 flex-col">
        <TabView
          activeIndex={documentsTab}
          className="wikiTabs flex flex-1 flex-col"
          onTabChange={(e) => setDocumentsTab(e.index)}
          renderActiveOnly>
          <TabPanel className="flex h-full w-full flex-1 flex-col" header="Documents">
            <DocumentsTree />
          </TabPanel>
          <TabPanel className="flex h-full w-full flex-1 flex-col" header="Templates">
            <TemplatesTree />
          </TabPanel>
        </TabView>
      </div>
    );

  return (
    <div className="flex h-full flex-1 flex-col  p-4">
      <ItemsTree type={type as AvailableItemTypes} />
    </div>
  );
}

export default function SecondarySidebar() {
  return (
    <SidebarContainer>
      <SidebarContent />
    </SidebarContainer>
  );
}
