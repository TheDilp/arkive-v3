import { useAtom } from "jotai";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";
import { TabPanel, TabView } from "primereact/tabview";
import { useLocation } from "react-router-dom";

import { useBreakpoint } from "../../hooks/useMediaQuery";
import { SidebarCollapseAtom } from "../../utils/Atoms/atoms";
import { setItem } from "../../utils/storage";
import BoardsTree from "../Tree/BoardsTree";
import CalendarsTree from "../Tree/CalendarsTree";
import DictionariesTree from "../Tree/DictionariesTree";
import DocumentsTree from "../Tree/DocumentsTree";
import MapsTree from "../Tree/MapsTree";
import ScreensTree from "../Tree/ScreensTree";
import TemplatesTree from "../Tree/TemplatesTree";
import SettingsSidebar from "./SecondarySidebarContent/SettingsSidebar";

type Props = {
  children: JSX.Element | null;
};
function SidebarContainer({ children }: Props) {
  const { isMd } = useBreakpoint();
  const [sidebar, setSidebar] = useAtom(SidebarCollapseAtom);

  return isMd ? (
    <PrimeSidebar
      className="treeSidebar bg-zinc-800 transition-all"
      onHide={() => {
        setSidebar(false);
        setItem("sidebarState", false);
      }}
      visible={sidebar}>
      {children}
    </PrimeSidebar>
  ) : (
    <div
      className={`flex ${
        sidebar ? "w-[20rem] min-w-[20rem] opacity-100" : "w-0"
      } max-w-[20rem] flex-col overflow-hidden bg-zinc-900 transition-all`}>
      {children}
    </div>
  );
}

function SidebarContent() {
  const { pathname } = useLocation();

  if (pathname.includes("documents"))
    return (
      <div className="flex flex-1 flex-col">
        <TabView className="wikiTabs flex flex-1 flex-col" renderActiveOnly>
          <TabPanel className="flex h-full w-full flex-1 flex-col" header="Documents">
            <DocumentsTree />
          </TabPanel>
          <TabPanel className="flex h-full w-full flex-1 flex-col" header="Templates">
            <TemplatesTree />
          </TabPanel>
        </TabView>
      </div>
    );
  if (pathname.includes("settings")) return <SettingsSidebar />;
  return (
    <div className="flex h-full flex-1 flex-col bg-zinc-900 p-4">
      {pathname.includes("maps") ? <MapsTree /> : null}
      {pathname.includes("boards") ? <BoardsTree /> : null}
      {pathname.includes("screens") ? <ScreensTree /> : null}
      {pathname.includes("dictionaries") ? <DictionariesTree /> : null}
      {pathname.includes("calendars") ? <CalendarsTree /> : null}
    </div>
  );

  // if (pathname.includes("timelines")) return <div className="flex flex-1 flex-col bg-zinc-900">TIMELINES</div>;
}

export default function SecondarySidebar() {
  return (
    <SidebarContainer>
      <SidebarContent />
    </SidebarContainer>
  );
}
