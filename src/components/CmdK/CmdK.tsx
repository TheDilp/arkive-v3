import { useAtom } from "jotai";
import { KBarAnimator, KBarPortal, KBarPositioner, KBarResults, KBarSearch, useMatches } from "kbar";
import { useMemo } from "react";
import { NavigateFunction } from "react-router-dom";
import { capitalCase } from "remirror";

import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { IconEnum } from "../../utils/DefaultValues/GeneralDefaults";
import { searchCategories } from "../../utils/searchUtils";
import { getItemTypeFromName } from "../../utils/transform";
import CMDKResultItem from "./CmdKResultItem";

function RenderResults() {
  const { results } = useMatches();

  //   @ts-ignore
  return <KBarResults items={results} onRender={CMDKResultItem} />;
}

const createNewOptions = [
  { name: "document", icon: IconEnum.document },
  { name: "map", icon: IconEnum.map },
  { name: "graph", icon: IconEnum.board },
  { name: "calendar", icon: IconEnum.calendar },
  { name: "timeline", icon: IconEnum.timeline },
  { name: "screen", icon: IconEnum.screen },
  { name: "dictionary", icon: IconEnum.dictionary },
  { name: "random table", icon: IconEnum.randomtables },
] as const;
const navigateToOptions = [
  { name: "documents", icon: IconEnum.document, shortcut: ["Shift+D"] },
  { name: "maps", icon: IconEnum.map, shortcut: ["Shift+M"] },
  { name: "boards", icon: IconEnum.board, shortcut: ["Shift+G"] },
  { name: "calendars", icon: IconEnum.calendar, shortcut: ["Shift+C"] },
  { name: "timelines", icon: IconEnum.timeline, shortcut: ["Shift+T"] },
  { name: "screens", icon: IconEnum.screen, shortcut: ["Shift+S"] },
  { name: "dictionaries", icon: IconEnum.dictionary, shortcut: ["Shift+Y"] },
  { name: "randomtables", icon: IconEnum.randomtables, shortcut: ["Shift+R"] },
] as const;

export function CMDKActions(navigate: NavigateFunction, project_id: string) {
  const [, setDrawer] = useAtom(DrawerAtom);
  const results = useMemo(
    () => [
      { id: "navigate", icon: IconEnum.chevron_right, name: "Navigate to...", keywords: "", shortcut: ["Shift+O"] },
      {
        id: "new",
        icon: IconEnum.add,

        name: "Create new",
        keywords: "",
        shortcut: ["Shift+N"],
      },
      {
        id: "search",
        icon: IconEnum.search,
        name: "Search for...",
        keywords: "",
        shortcut: ["Shift+E"],
      },
      ...navigateToOptions.map((opt) => ({
        id: `navigate_${opt.name}`,
        icon: opt.icon,
        name: `${capitalCase(opt.name)}`,
        keywords: "",
        shortcut: opt.shortcut,
        parent: "navigate",
        perform: () => navigate(`/project/${project_id}/${opt.name}`),
      })),
      ...createNewOptions.map((opt) => ({
        id: `new_${opt.name}`,
        icon: opt.icon,
        name: `New ${capitalCase(opt.name)}`,
        keywords: "",
        parent: "new",
        perform: () => setDrawer({ ...DefaultDrawer, show: true, type: getItemTypeFromName(opt.name) }),
      })),
      {
        id: "all_search",
        name: "All",
        icon: IconEnum.search,
        keywords: "",
        parent: "search",
        perform: () =>
          setDrawer({
            ...DefaultDrawer,
            type: "full_search",
            show: true,
            drawerSize: "md",
          }),
      },
      ...searchCategories.map((category) => ({
        id: `${category}_search`,
        name: capitalCase(category.label),
        icon: category.icon,
        keywords: "",
        parent: "search",
        perform: () =>
          setDrawer({
            ...DefaultDrawer,
            type: "full_search",
            show: true,
            drawerSize: "md",
            data: { index: 1, category: category.value },
          }),
      })),
    ],
    [],
  );
  return results;
}

export default function CmdK() {
  return (
    <KBarPortal>
      <KBarPositioner className="z-[999999999]">
        <KBarAnimator className="w-96">
          <KBarSearch className="p-inputtext w-full" />
          <RenderResults />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}
