import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PublicBoardsContainer from "../PublicView/Public Boards/PublicBoardsContainer";
import PublicMaps from "../PublicView/PublicMaps/PublicMaps";
import PublicWiki from "../PublicView/Wiki/PublicWiki";
import LoadingScreen from "../Util/LoadingScreen";
export default function PublicProject() {
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
        <Suspense fallback={<LoadingScreen />}>
          <Route path="maps/:map_id" element={<PublicMaps />} />
        </Suspense>
        <Route
          path="boards/:board_id"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <PublicBoardsContainer />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}
