import { useAtomValue } from "jotai";
import { lazy } from "react";
import { useParams } from "react-router-dom";

import { PermissionCategoriesType, PermissionType } from "../../types/generalTypes";
import { PermissionAtom } from "../../utils/Atoms/atoms";

const EditorContentWrapper = lazy(() => import("../Editor/EditorContentWrapper"));
const MapView = lazy(() => import("../MapView/MapView"));
const BoardView = lazy(() => import("../BoardView/BoardView"));
const ScreenView = lazy(() => import("../ScreenView/ScreenView"));
const DictionaryView = lazy(() => import("../DictionaryView/DictionaryView"));
const CalendarView = lazy(() => import("../CalendarView/CalendarView"));
const TimelineView = lazy(() => import("../TimelineView/TimelineView"));
const RandomTableView = lazy(() => import("../RandomTableView/RandomTableView"));

function isViewOnly(permissions: PermissionType | "owner" | null, type: PermissionCategoriesType) {
  if (typeof permissions === "object" && permissions !== null) {
    return permissions[type] === "View";
  }
  return false;
}

export default function ContentView() {
  const { type } = useParams();

  const permissions = useAtomValue(PermissionAtom);

  if (type === "documents") return <EditorContentWrapper />;
  if (type === "maps") return <MapView />;
  if (type === "boards") return <BoardView isViewOnly={isViewOnly(permissions, "boards")} />;
  if (type === "screens") return <ScreenView />;
  if (type === "dictionaries") return <DictionaryView />;
  if (type === "calendars") return <CalendarView />;
  if (type === "timelines") return <TimelineView />;
  if (type === "randomtables") return <RandomTableView />;
  return null;
}
