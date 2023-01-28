import { lazy } from "react";
import { useParams } from "react-router-dom";

const Editor = lazy(() => import("../Editor/Editor"));
const MapView = lazy(() => import("../MapView/MapView"));
const BoardView = lazy(() => import("../BoardView/BoardView"));
const ScreenView = lazy(() => import("../ScreenView/ScreenView"));
const DictionaryView = lazy(() => import("../DictionaryView/DictionaryView"));

export default function ContentView() {
  const { type } = useParams();
  console.log(type);
  if (type === "documents") return <Editor editable />;
  if (type === "maps") return <MapView />;
  if (type === "boards") return <BoardView />;
  if (type === "screens") return <ScreenView />;
  if (type === "dictionaries") return <DictionaryView />;
  return null;
}
