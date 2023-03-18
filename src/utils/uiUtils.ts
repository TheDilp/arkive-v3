import { IconCategoriesType, NavItemType } from "../types/generalTypes";
import { IconEnum } from "./DefaultValues/GeneralDefaults";

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
  { icon: IconEnum.document, navigate: "./documents", tooltip: "Documents" },
  { icon: IconEnum.map, navigate: "./maps", tooltip: "Maps" },
  { icon: IconEnum.board, navigate: "./boards", tooltip: "Graphs" },
  { icon: IconEnum.calendar, navigate: "./calendars", tooltip: "Calendars" },
  { icon: IconEnum.timeline, navigate: "./timelines", tooltip: "Timelines" },
  { icon: IconEnum.screen, navigate: "./screens", tooltip: "Screens" },
  { icon: IconEnum.dictionary, navigate: "./dictionaries", tooltip: "Dictionaries" },
  { icon: IconEnum.randomtables, navigate: "./randomtables", tooltip: "Random_Tables" },
  // { icon: "carbon:template", navigate: "./forms", tooltip: "Forms" },
];
export const settingsItems: { icon: string; title: string; navigate: string }[] = [
  {
    icon: "mdi:home",
    navigate: "./settings/project-settings",
    title: "Project",
  },
  { icon: IconEnum.document, navigate: "./settings/document-settings", title: "Documents" },
  { icon: IconEnum.map, navigate: "./settings/map-settings", title: "Maps" },
  { icon: IconEnum.board, navigate: "./settings/board-settings", title: "Graphs" },
  { icon: IconEnum.calendar, navigate: "./settings/calendar-settings", title: "Calendars" },
  // { icon: "mdi:timeline-outline", navigate: "./timelines", tooltip: "Timelines" },
  { icon: IconEnum.board, navigate: "./settings/screen-settings", title: "Screens" },
  { icon: IconEnum.dictionary, navigate: "./settings/dictionary-settings", title: "Dictionaries" },
  { icon: IconEnum.randomtables, navigate: "./settings/randomtable-settings", title: "Random Tables" },
  { icon: IconEnum.tags, navigate: "./settings/tag-settings", title: "Tags" },
  { icon: "ic:baseline-miscellaneous-services", navigate: "./settings/misc-settings", title: "Miscellaneous" },

  // { icon: "carbon:template", navigate: "./forms", tooltip: "Forms" },
];

export function checkIfOwner(permission?: null | "owner" | "member") {
  if (permission && permission === "owner") return true;
  return false;
}

export function scrollElementIntoView(selector: string) {
  const el = document.querySelector(selector);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function getTabForIconSelect(iconTypes: IconCategoriesType[]) {
  const tabs = [];
  if (iconTypes.includes("general")) tabs.push({ label: "General", icon: "pi pi-fw pi-file" });
  if (iconTypes.includes("weather")) tabs.push({ label: "Weather", icon: "pi pi-fw pi-sun" });

  return tabs;
}
