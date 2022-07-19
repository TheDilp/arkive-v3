import cytoscape from "cytoscape";
import clipboard from "cytoscape-clipboard";
import edgehandles from "cytoscape-edgehandles";
import gridguide from "cytoscape-grid-guide";
import jquery from "jquery";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import BoardView from "../Boards/BoardView";
import BoardRefsProvider from "../Context/BoardRefsContext";
import MapView from "../Maps/Map/MapView";
import PublicWiki from "../PublicView/Wiki/PublicWiki";
import LoadingScreen from "../Util/LoadingScreen";
export default function PublicProject() {
  cytoscape.use(edgehandles);
  cytoscape.use(gridguide);
  clipboard(cytoscape, jquery);
  return (
    <div className="w-screen h-screen">
      <Routes>
        <Route
          path="wiki/:doc_id"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <PublicWiki />
            </Suspense>
          }
        />
        <Route
          path="maps/:map_id"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <MapView public_view={true} />
            </Suspense>
          }
        />
        <Route
          path="boards/:board_id"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BoardRefsProvider>
                <BoardView public_view={true} />
              </BoardRefsProvider>
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}
