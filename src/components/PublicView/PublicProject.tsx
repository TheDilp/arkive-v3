import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import BoardView from "../Boards/BoardView";
import BoardRefsProvider from "../Context/BoardRefsContext";
import MapView from "../Maps/Map/MapView";
import PublicWiki from "../PublicView/Wiki/PublicWiki";
import TimelineView from "../Timelines/TimelineView";
import LoadingScreen from "../Util/LoadingScreen";
export default function PublicProject() {
  return (
    <div className="w-screen h-screen">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
        integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
        crossOrigin=""
      />
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
        <Route
          path="timelines/:timeline_id"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <TimelineView public_view={true} />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}
