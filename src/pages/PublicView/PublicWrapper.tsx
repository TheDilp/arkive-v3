import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";

import LoadingScreen from "../../components/Loading/LoadingScreen";

const BoardView = lazy(() => import("../BoardView/BoardView"));
const MapView = lazy(() => import("../MapView/MapView"));
const PublicDocumentView = lazy(() => import("./PublicDocumentView"));
export default function PublicWrapper() {
  const { type } = useParams();

  return (
    <Suspense fallback={<LoadingScreen />}>
      {type === "documents" ? <PublicDocumentView /> : null}
      {type === "maps" ? <MapView isReadOnly /> : null}
      {type === "boards" ? <BoardView isReadOnly /> : null}
    </Suspense>
  );
}
