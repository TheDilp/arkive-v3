import { TabPanel, TabView } from "primereact/tabview";
import { useLocation } from "react-router-dom";
import BaseTree from "../Tree/BaseTree";
type Props = {};

export default function Sidebar({}: Props) {
  const { pathname } = useLocation();
  if (pathname.includes("wiki"))
    return (
      <div className="bg-gray-800 w-2 flex flex-col">
        <TabView
          className="w-full p-0 wikiTabs"
          panelContainerClassName="pr-0"
          renderActiveOnly={true}
        >
          <TabPanel header="Documents" className="p-0 surface-50 ">
            <BaseTree type="documents" />
          </TabPanel>
          <TabPanel header="Templates" className="surface-50"></TabPanel>
        </TabView>
      </div>
    );

  return null;
}
