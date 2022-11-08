import { TabPanel, TabView } from "primereact/tabview";
import { useLocation } from "react-router-dom";
import DocumentsTree from "../Tree/DocumentsTree";
type Props = {};

export default function Sidebar({}: Props) {
  const { pathname } = useLocation();
  if (pathname.includes("wiki"))
    return (
      <div className="bg-gray-800 w-2 flex flex-col">
        <TabView
          className="w-full p-0 wikiTabs"
          panelContainerClassName="mt-2 p-0"
          renderActiveOnly={true}
        >
          <TabPanel header="Documents" className="p-2 surface-50 max-w-full">
            <DocumentsTree />
          </TabPanel>
          <TabPanel header="Templates" className="surface-50"></TabPanel>
        </TabView>
      </div>
    );

  return null;
}
