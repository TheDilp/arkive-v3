import { AllAvailableTypes, IconCategoriesType, NavItemType } from "../types/generalTypes";
import { IconEnum } from "./DefaultValues/GeneralDefaults";
import { getItem, setItem } from "./storage";

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
  { icon: IconEnum.screen, navigate: "./settings/screen-settings", title: "Screens" },
  { icon: IconEnum.dictionary, navigate: "./settings/dictionary-settings", title: "Dictionaries" },
  { icon: IconEnum.randomtables, navigate: "./settings/randomtable-settings", title: "Random Tables" },
  { icon: IconEnum.tags, navigate: "./settings/tag-settings", title: "Tags" },
  { icon: IconEnum.alter_names, navigate: "./settings/alternative-names-settings", title: "Alternative Names" },
  { icon: IconEnum.image, navigate: "./settings/asset-settings", title: "Assets" },
  { icon: IconEnum.permissions, navigate: "./settings/roles-settings", title: "Roles" },
  { icon: IconEnum.users, navigate: "./settings/members-settings", title: "Members" },
  { icon: "ic:baseline-miscellaneous-services", navigate: "./settings/misc-settings", title: "Miscellaneous" },

  // { icon: "carbon:template", navigate: "./forms", tooltip: "Forms" },
];

export function checkIfOwner(permission?: null | "owner") {
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

export function bytesToSize(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "n/a";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i === 0) return `${bytes} ${sizes[i]})`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

export function getCDNImage(image: string) {
  return image.replace(
    "https://the-arkive-v3.nyc3.digitaloceanspaces.com",
    "https://the-arkive-v3.nyc3.cdn.digitaloceanspaces.com",
  );
}

export function setExpanded(type: AllAvailableTypes, id: string, isExpanded: boolean) {
  const getItems = (getItem(`${type}-expanded`) || []) as string[];
  if (isExpanded)
    setItem(
      `${type}-expanded`,
      getItems.filter((item: string) => item !== id),
    );
  else setItem(`${type}-expanded`, [...getItems, id]);
}

export function generateHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export function checkIfCategoryAllowed(permission: "owner" | null) {
  if (permission === "owner") return true;
  if (permission === null) return false;

  return false;
}
