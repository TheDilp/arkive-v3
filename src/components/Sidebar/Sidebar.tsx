import { TabPanel, TabView } from "primereact/tabview";
import { useLocation } from "react-router-dom";

import DocumentsTree from "../Tree/DocumentsTree";
import MapsTree from "../Tree/MapsTree";
import TemplatesTree from "../Tree/TemplatesTree";

export default function Sidebar() {
  const { pathname } = useLocation();
  if (pathname.includes("wiki"))
    return (
      <div className="flex flex-col flex-1">
        <TabView className="flex flex-col flex-1" renderActiveOnly>
          <TabPanel className="w-full h-full flex flex-col flex-1" header="Documents">
            <DocumentsTree />
          </TabPanel>
          <TabPanel className="w-full h-full flex flex-col flex-1" header="Templates">
            <TemplatesTree />
          </TabPanel>
        </TabView>
      </div>
    );
  if (pathname.includes("maps"))
    return (
      <div className="h-full flex flex-col flex-1 p-4 bg-zinc-800">
        <MapsTree />
      </div>
    );
  if (pathname.includes("boards")) return <div className="flex flex-col flex-1 bg-zinc-800">BOARDS</div>;
  if (pathname.includes("timelines")) return <div className="flex flex-col flex-1 bg-zinc-800">TIMELINES</div>;

  return null;
}
