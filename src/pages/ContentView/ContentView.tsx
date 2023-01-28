import { lazy } from "react";
import { useParams } from "react-router-dom";

const Editor = lazy(() => import("../Editor/Editor"));
const MapView = lazy(() => import("../MapView/MapView"));
const BoardView = lazy(() => import("../BoardView/BoardView"));
const ScreenView = lazy(() => import("../ScreenView/ScreenView"));

export default function ContentView() {
  const { type } = useParams();
  if (type === "documents") return <Editor editable />;
  if (type === "maps") return <MapView />;
  if (type === "boards") return <BoardView />;
  if (type === "screens") return <ScreenView />;
  return null;
}
