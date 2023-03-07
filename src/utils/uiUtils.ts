import { NavItemType } from "../types/generalTypes";

export const virtualScrollerSettings = {
  delay: 10,
  resizeDelay: 150,
  autoSize: true,
  numToleratedItems: 5,
  itemSize: 45,
};

export const navItems: NavItemType[] = [
  {
    icon: "mdi:home",
    navigate: "/",
    tooltip: "Projects",
  },
  { icon: "ion:documents-outline", navigate: "./documents", tooltip: "Documents" },
  { icon: "mdi:map-outline", navigate: "./maps", tooltip: "Maps" },
  { icon: "ph:graph", navigate: "./boards", tooltip: "Graphs" },
  { icon: "ph:calendar-blank", navigate: "./calendars", tooltip: "Calendars" },
  { icon: "mdi:timeline-clock-outline", navigate: "./timelines", tooltip: "Timelines" },
  { icon: "fluent:board-24-regular", navigate: "./screens", tooltip: "Screens" },
  { icon: "mdi-light:book", navigate: "./dictionaries", tooltip: "Dictionaries" },
  { icon: "arcticons:reroll", navigate: "./randomtables", tooltip: "Random_Tables" },
  // { icon: "carbon:template", navigate: "./forms", tooltip: "Forms" },
];
export const settingsItems: { icon: string; title: string; navigate: string }[] = [
  {
    icon: "mdi:home",
    navigate: "./settings/project-settings",
    title: "Project",
  },
  { icon: "ion:documents-outline", navigate: "./settings/document-settings", title: "Documents" },
  { icon: "mdi:map-outline", navigate: "./settings/map-settings", title: "Maps" },
  { icon: "ph:graph", navigate: "./settings/board-settings", title: "Graphs" },
  { icon: "ph:calendar-blank", navigate: "./settings/calendar-settings", title: "Calendars" },
  // { icon: "mdi:timeline-outline", navigate: "./timelines", tooltip: "Timelines" },
  { icon: "fluent:board-24-regular", navigate: "./settings/screen-settings", title: "Screens" },
  { icon: "mdi-light:book", navigate: "./settings/dictionary-settings", title: "Dictionaries" },
  { icon: "arcticons:reroll", navigate: "./settings/randomtable-settings", title: "Random Tables" },
  { icon: "mdi:tags", navigate: "./settings/tag-settings", title: "Tags" },
  { icon: "ic:baseline-miscellaneous-services", navigate: "./settings/misc-settings", title: "Miscellaneous" },

  // { icon: "carbon:template", navigate: "./forms", tooltip: "Forms" },
];

export function checkIfOwner(permission?: null | "owner" | "member") {
  if (permission && permission === "owner") return true;
  return false;
}
