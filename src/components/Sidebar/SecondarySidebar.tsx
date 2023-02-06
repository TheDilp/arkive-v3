import { useAtom } from "jotai";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";
import { TabPanel, TabView } from "primereact/tabview";
import { useParams } from "react-router-dom";

import { useBreakpoint } from "../../hooks/useMediaQuery";
import { AvailableItemTypes } from "../../types/generalTypes";
import { SidebarCollapseAtom } from "../../utils/Atoms/atoms";
import { setItem } from "../../utils/storage";
import DocumentsTree from "../Tree/DocumentsTree";
import ItemsTree from "../Tree/ItemsTree";
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
  const { type } = useParams();

  if (type === "documents")
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
  if (type === "settings") return <SettingsSidebar />;
  return (
    <div className="flex h-full flex-1 flex-col bg-zinc-900 p-4">
      <ItemsTree type={type as AvailableItemTypes} />
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
