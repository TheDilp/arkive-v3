import { TabPanel, TabView } from "primereact/tabview";

import DrawerManyNodesContent from "./DrawerManyNodesContent";

export default function DrawerBulkBoardEdit() {
  return (
    <TabView className="p-0" renderActiveOnly>
      <TabPanel className="mt-1 p-0" contentClassName="p-0" header="Nodes">
        <DrawerManyNodesContent />
      </TabPanel>
      <TabPanel className="mt-1" header="Edges">
        EDGES
      </TabPanel>
    </TabView>
  );
}
