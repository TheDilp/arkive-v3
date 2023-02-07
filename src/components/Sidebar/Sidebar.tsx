/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useCreateProject } from "../../CRUD/ProjectCRUD";
import { SidebarCollapseAtom } from "../../utils/Atoms/atoms";
import { setItem } from "../../utils/storage";

type NavItemType = {
  icon: string;
  navigate: string;
  tooltip: string;
};
const navItems: NavItemType[] = [
  {
    icon: "mdi:home",
    navigate: "/",
    tooltip: "Projects",
  },
  { icon: "ion:documents-outline", navigate: "./documents", tooltip: "Documents" },
  { icon: "mdi:map-outline", navigate: "./maps", tooltip: "Maps" },
  { icon: "ph:graph", navigate: "./boards", tooltip: "Graphs" },
  { icon: "ph:calendar-blank", navigate: "./calendars", tooltip: "Calendars" },
  // { icon: "mdi:timeline-outline", navigate: "./timelines", tooltip: "Timelines" },
  { icon: "fluent:board-24-regular", navigate: "./screens", tooltip: "Screens" },
  { icon: "mdi-light:book", navigate: "./dictionaries", tooltip: "Dictionaries" },
  { icon: "arcticons:reroll", navigate: "./randomtables", tooltip: "Random Tables" },
  // { icon: "carbon:template", navigate: "./forms", tooltip: "Forms" },
];

function SidebarProjectItems({ items, pathname }: { items: NavItemType[]; pathname: string }) {
  const [sidebarToggle, setSidebarToggle] = useAtom(SidebarCollapseAtom);
  const navigate = useNavigate();

  return (
    <>
      <li className="flex h-14 items-center">
        <Icon
          className="cursor-pointer hover:text-blue-300"
          fontSize={28}
          icon={`mdi:${sidebarToggle ? "menu-open" : "menu"}`}
          onClick={() => {
            setSidebarToggle(!sidebarToggle);
            setItem("sidebarState", !sidebarToggle);
          }}
        />
      </li>
      {items.map((item) => (
        <Fragment key={item.icon}>
          <Tooltip content={item.tooltip} position="right" target={`.${item.tooltip}`} />
          <li
            className={` ${
              item.tooltip
            } flex h-14 cursor-pointer items-center justify-center transition-colors hover:text-sky-400 ${
              item.navigate !== "/" && pathname.includes(item.navigate.replace("./", "")) ? "text-sky-400" : ""
            }`}
            onClick={() => {
              navigate(item.navigate);
            }}>
            <Icon fontSize={28} icon={item.icon} />
          </li>
        </Fragment>
      ))}
      <hr className="mb-2 w-full border-zinc-800" />

      <li className="mt-auto h-14">
        <Icon
          className="cursor-pointer hover:text-blue-300"
          fontSize={28}
          icon="mdi:cog"
          onClick={() => {
            navigate("./settings/project-settings");
          }}
        />
      </li>
    </>
  );
}

function SidebarDashBoardItems() {
  const { mutate: createProjectMutation, isLoading } = useCreateProject();

  return (
    <li className="mt-14">
      <Button
        className="p-button-text p-button-secondary"
        loading={isLoading}
        onClick={() => createProjectMutation()}
        tooltip="Create new project"
        tooltipOptions={{ position: "right" }}>
        {isLoading ? null : <Icon className="newSectionButton text-white" fontSize={28} icon="mdi:plus" />}
      </Button>
    </li>
  );
}

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <div className="flex w-16 min-w-[4rem] flex-col border-r border-zinc-800 bg-zinc-900">
      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col items-center">
          {pathname === "/" ? <SidebarDashBoardItems /> : <SidebarProjectItems items={navItems} pathname={pathname} />}
        </ul>
      </nav>
    </div>
  );
}
