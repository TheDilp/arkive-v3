import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { ProgressSpinner } from "primereact/progressspinner";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";
import { TabPanel, TabView } from "primereact/tabview";
import { Link, useLocation } from "react-router-dom";

import { useBreakpoint } from "../../hooks/useMediaQuery";
import { SidebarCollapseAtom } from "../../utils/Atoms/atoms";
import BoardsTree from "../Tree/BoardsTree";
import DocumentsTree from "../Tree/DocumentsTree";
import FormsTree from "../Tree/FormsTree";
import MapsTree from "../Tree/MapsTree";
import TemplatesTree from "../Tree/TemplatesTree";

type Props = {
  children: JSX.Element | null;
};
function SidebarContainer({ children }: Props) {
  const { isMd } = useBreakpoint();
  const [sidebar, setSidebar] = useAtom(SidebarCollapseAtom);

  return isMd ? (
    <PrimeSidebar className="treeSidebar bg-zinc-800" onHide={() => setSidebar(false)} visible={sidebar}>
      {children}
    </PrimeSidebar>
  ) : (
    children
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
  if (pathname.includes("maps"))
    return (
      <div className="flex h-full flex-1 flex-col bg-zinc-900 p-4">
        <MapsTree />
      </div>
    );
  if (pathname.includes("boards"))
    return (
      <div className="flex flex-1 flex-col bg-zinc-900 p-4">
        <BoardsTree />
      </div>
    );
  if (pathname.includes("forms"))
    return (
      <div className="flex h-full flex-1 flex-col bg-zinc-900 p-4">
        <FormsTree />
      </div>
    );
  if (pathname.includes("timelines")) return <div className="flex flex-1 flex-col bg-zinc-900">TIMELINES</div>;
  if (pathname.includes("settings"))
    return (
      <div className="flex flex-1 flex-col bg-zinc-900 p-4">
        <ul className="flex w-full flex-col gap-y-1 font-Lato text-sm">
          <Link
            className={`flex cursor-pointer items-center gap-x-4 rounded py-2 px-4  hover:text-white ${
              pathname.includes("project-settings") ? "bg-sky-700 text-white" : "text-zinc-500"
            }`}
            to="./settings/project-settings">
            <Icon fontSize={18} icon="mdi:cogs" />
            Project Settings
          </Link>
          <Link
            className={`flex cursor-pointer items-center gap-x-4 rounded py-2 px-4  hover:text-white ${
              pathname.includes("document-settings") ? "bg-sky-700 text-white" : "text-zinc-500"
            }`}
            to="./settings/document-settings">
            <Icon fontSize={18} icon="mdi:files" />
            Document Settings
          </Link>
          <Link
            className={`flex cursor-pointer items-center gap-x-4 rounded py-2 px-4  hover:text-white ${
              pathname.includes("map-settings") ? "bg-sky-700 text-white" : "text-zinc-500"
            }`}
            to="./settings/map-settings">
            <Icon fontSize={18} icon="mdi:map" />
            Map Settings
          </Link>
          <Link
            className={`flex cursor-pointer items-center gap-x-4 rounded py-2 px-4  hover:text-white ${
              pathname.includes("board-settings") ? "bg-sky-700 text-white" : "text-zinc-500"
            }`}
            to="./settings/board-settings">
            <Icon fontSize={18} icon="mdi:draw" />
            Board Settings
          </Link>
          <Link
            className={`flex cursor-pointer items-center gap-x-4 rounded py-2 px-4  hover:text-white ${
              pathname.includes("tags-settings") ? "bg-sky-700 text-white" : "text-zinc-500"
            }`}
            to="./settings/tags-settings">
            <Icon fontSize={18} icon="mdi:tags" />
            Tags
          </Link>
          <Link
            className={`flex cursor-pointer items-center gap-x-4 rounded py-2 px-4  hover:text-white ${
              pathname.includes("assets-settings") ? "bg-sky-700 text-white" : "text-zinc-500"
            }`}
            to="./settings/assets-settings">
            <Icon fontSize={18} icon="ion:images" />
            Assets
          </Link>
        </ul>
      </div>
    );
  return null;
}
export default function SecondarySidebar({ isLoading }: { isLoading: boolean }) {
  const { pathname } = useLocation();
  if (!pathname.includes("settings") && isLoading) return <ProgressSpinner />;
  return (
    <SidebarContainer>
      <SidebarContent />
    </SidebarContainer>
  );
}
