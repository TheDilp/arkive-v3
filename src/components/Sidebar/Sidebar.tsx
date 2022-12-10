import { TabPanel, TabView } from "primereact/tabview";
import { useLocation } from "react-router-dom";

import BoardsTree from "../Tree/BoardsTree";
import DocumentsTree from "../Tree/DocumentsTree";
import MapsTree from "../Tree/MapsTree";
import TemplatesTree from "../Tree/TemplatesTree";

export default function Sidebar() {
  const { pathname } = useLocation();
  if (pathname.includes("documents"))
    return (
      <div className="flex flex-1 flex-col">
        <TabView className="flex flex-1 flex-col" renderActiveOnly>
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
      <div className="flex h-full flex-1 flex-col bg-zinc-800 p-4">
        <MapsTree />
      </div>
    );
  if (pathname.includes("boards"))
    return (
      <div className="flex flex-1 flex-col bg-zinc-800 p-4">
        <BoardsTree />
      </div>
    );
  if (pathname.includes("timelines")) return <div className="flex flex-1 flex-col bg-zinc-800">TIMELINES</div>;

  return null;
}
