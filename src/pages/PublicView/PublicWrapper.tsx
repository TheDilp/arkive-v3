import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";

import Drawer from "../../components/Drawer/Drawer";
import LoadingScreen from "../../components/Loading/LoadingScreen";

const BoardView = lazy(() => import("../BoardView/BoardView"));
const MapView = lazy(() => import("../MapView/MapView"));
const CalendarView = lazy(() => import("../CalendarView/CalendarView"));
const PublicDocumentView = lazy(() => import("./PublicDocumentView"));
export default function PublicWrapper() {
  const { type } = useParams();

  return (
    <Suspense fallback={<LoadingScreen />}>
      {type === "documents" ? <PublicDocumentView /> : null}
      {type === "maps" ? (
        <>
          <Drawer />
          <MapView isReadOnly />
        </>
      ) : null}
      {type === "boards" ? <BoardView isReadOnly /> : null}
      {type === "calendars" ? (
        <>
          <Drawer />

          <CalendarView isReadOnly />
        </>
      ) : null}
    </Suspense>
  );
}
