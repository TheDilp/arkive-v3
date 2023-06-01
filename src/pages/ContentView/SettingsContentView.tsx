import { useAtomValue } from "jotai";
import { lazy } from "react";
import { Navigate, To, useParams } from "react-router-dom";

import { RoleAtom } from "../../utils/Atoms/atoms";

const ProjectSettings = lazy(() => import("../Settings/ProjectSettings"));
const DocumentSettings = lazy(() => import("../Settings/DocumentSettings"));
const MapSettings = lazy(() => import("../Settings/MapSettings"));
const BoardSettings = lazy(() => import("../Settings/BoardSettings"));
const CalendarSettings = lazy(() => import("../Settings/CalendarSettings"));
const ScreenSettings = lazy(() => import("../Settings/ScreenSettings"));
const DictionarySettings = lazy(() => import("../Settings/DictionarySettings"));
const RandomTableSettings = lazy(() => import("../Settings/RandomTableSettings"));
const TagsSettings = lazy(() => import("../Settings/TagsSettings"));
const AlternativeNamesSettings = lazy(() => import("../Settings/AlternativeNameSettings"));
const RoleSettings = lazy(() => import("../Settings/RoleSettings"));
const AssetSettings = lazy(() => import("../Settings/Assets/AssetSettings"));
const MemberSettings = lazy(() => import("../Settings/MemberSettings"));
const MiscellaneousSettings = lazy(() => import("../Settings/MiscellaneousSettings"));

export default function SettingsContentView() {
  const { type } = useParams();
  const userRole = useAtomValue(RoleAtom);
  if (!userRole?.is_owner) {
    console.log(userRole?.is_owner);
    return <Navigate to={-1 as To} />;
  }
  if (type === "project-settings") return <ProjectSettings />;
  if (type === "document-settings") return <DocumentSettings />;
  if (type === "map-settings") return <MapSettings />;
  if (type === "board-settings") return <BoardSettings />;
  if (type === "calendar-settings") return <CalendarSettings />;
  if (type === "screen-settings") return <ScreenSettings />;
  if (type === "dictionary-settings") return <DictionarySettings />;
  if (type === "randomtable-settings") return <RandomTableSettings />;
  if (type === "tag-settings") return <TagsSettings />;
  if (type === "alternative-names-settings") return <AlternativeNamesSettings />;
  if (type === "roles-settings") return <RoleSettings />;
  if (type === "members-settings") return <MemberSettings />;
  if (type === "asset-settings") return <AssetSettings />;
  if (type === "misc-settings") return <MiscellaneousSettings />;
  return null;
}
