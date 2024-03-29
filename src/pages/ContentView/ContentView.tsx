import { useAtomValue } from "jotai";
import { lazy } from "react";
import { useParams } from "react-router-dom";

import { EditorSkeleton } from "../../components/Skeleton/Skeleton";
import { RoleAtom } from "../../utils/Atoms/atoms";

const EditorContentWrapper = lazy(() => import("../Editor/EditorContentWrapper"));
const MapView = lazy(() => import("../MapView/MapView"));
const BoardView = lazy(() => import("../BoardView/BoardView"));
const ScreenView = lazy(() => import("../ScreenView/ScreenView"));
const DictionaryView = lazy(() => import("../DictionaryView/DictionaryView"));
const CalendarView = lazy(() => import("../CalendarView/CalendarView"));
const TimelineView = lazy(() => import("../TimelineView/TimelineView"));
const RandomTableView = lazy(() => import("../RandomTableView/RandomTableView"));

function PermissionWrapper({ children, type }: { children: JSX.Element[] | JSX.Element | null; type: string | undefined }) {
  const UserRole = useAtomValue(RoleAtom);
  if (!UserRole) return <div className="w-full p-4">{type === "documents" ? <EditorSkeleton /> : null}</div>;
  return <span className="h-full w-full">{children}</span>;
}

export default function ContentView() {
  const { type } = useParams();
  return (
    <PermissionWrapper type={type}>
      <>
        {type === "documents" ? <EditorContentWrapper /> : null}
        {type === "maps" ? <MapView /> : null}
        {type === "boards" ? <BoardView /> : null}
        {type === "screens" ? <ScreenView /> : null}
        {type === "dictionaries" ? <DictionaryView /> : null}
        {type === "calendars" ? <CalendarView /> : null}
        {type === "timelines" ? <TimelineView /> : null}
        {type === "randomtables" ? <RandomTableView /> : null}
      </>
    </PermissionWrapper>
  );
}
