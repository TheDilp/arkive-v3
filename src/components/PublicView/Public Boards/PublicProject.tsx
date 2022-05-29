import { Outlet } from "react-router-dom";
import cytoscape from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import gridguide from "cytoscape-grid-guide";
type Props = {};

export default function PublicProject({}: Props) {
  cytoscape.use(edgehandles);
  cytoscape.use(gridguide);
  return (
    <div className="w-screen h-screen">
      <Outlet />
    </div>
  );
}
