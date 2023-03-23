import { lazy } from "react";
import { useParams } from "react-router-dom";

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
const MiscellaneousSettings = lazy(() => import("../Settings/MiscellaneousSettings"));
const AssetSettings = lazy(() => import("../Settings/Assets/AssetSettings"));

export default function SettingsContentView() {
  const { type } = useParams();

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
  if (type === "misc-settings") return <MiscellaneousSettings />;
  if (type === "asset-settings") return <AssetSettings />;
  return null;
}
