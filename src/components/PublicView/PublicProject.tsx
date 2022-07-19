import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PublicMaps from "../PublicView/PublicMaps/PublicMaps";
import PublicWiki from "../PublicView/Wiki/PublicWiki";
import LoadingScreen from "../Util/LoadingScreen";
import cytoscape from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import gridguide from "cytoscape-grid-guide";
import BoardView from "../Boards/BoardView";
import BoardRefsProvider from "../Context/BoardRefsContext";
export default function PublicProject() {
  cytoscape.use(edgehandles);
  cytoscape.use(gridguide);
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
              <PublicMaps />
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
