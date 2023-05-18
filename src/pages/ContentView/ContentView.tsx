import { lazy } from "react";
import { useParams } from "react-router-dom";

const EditorContentWrapper = lazy(() => import("../Editor/EditorContentWrapper"));
const MapView = lazy(() => import("../MapView/MapView"));
const BoardView = lazy(() => import("../BoardView/BoardView"));
const ScreenView = lazy(() => import("../ScreenView/ScreenView"));
const DictionaryView = lazy(() => import("../DictionaryView/DictionaryView"));
const CalendarView = lazy(() => import("../CalendarView/CalendarView"));
const TimelineView = lazy(() => import("../TimelineView/TimelineView"));
const RandomTableView = lazy(() => import("../RandomTableView/RandomTableView"));
const EntityView = lazy(() => import("../EntityView/EntityView"));

export default function ContentView() {
  const { type } = useParams();

  if (type === "documents") return <EditorContentWrapper />;
  if (type === "maps") return <MapView />;
  if (type === "boards") return <BoardView />;
  if (type === "screens") return <ScreenView />;
  if (type === "dictionaries") return <DictionaryView />;
  if (type === "calendars") return <CalendarView />;
  if (type === "timelines") return <TimelineView />;
  if (type === "randomtables") return <RandomTableView />;
  if (type === "entities") return <EntityView />;
  return null;
}
