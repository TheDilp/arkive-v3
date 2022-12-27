import { TabPanel, TabView } from "primereact/tabview";

import DrawerManyArrowsContent from "./DrawerManyArrowsContent";
import DrawerManyEdgesContent from "./DrawerManyEdgesContent";
import DrawerManyNodesContent from "./DrawerManyNodesContent";

export default function DrawerBulkBoardEdit() {
  return (
    <TabView className="mt-1" renderActiveOnly>
      <TabPanel header="Nodes">
        <DrawerManyNodesContent />
      </TabPanel>
      <TabPanel header="Edges">
        <DrawerManyEdgesContent />
      </TabPanel>
      <TabPanel header="Arrows">
        <DrawerManyArrowsContent />
      </TabPanel>
    </TabView>
  );
}
