/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Icon } from "@iconify/react";
import { useAtom, useAtomValue } from "jotai";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useCreateProject } from "../../CRUD/ProjectCRUD";
import { NavItemType } from "../../types/generalTypes";
import { SidebarCollapseAtom, ThemeAtom, UserAtom } from "../../utils/Atoms/atoms";
import { IconEnum } from "../../utils/DefaultValues/GeneralDefaults";
import { setItem } from "../../utils/storage";
import { checkIfOwner, navItems } from "../../utils/uiUtils";

function SidebarProjectItems({ items, pathname }: { items: NavItemType[]; pathname: string }) {
  const [sidebarToggle, setSidebarToggle] = useAtom(SidebarCollapseAtom);
  const navigate = useNavigate();
  const userData = useAtomValue(UserAtom);
  const isOwner = checkIfOwner(userData?.permission);
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
        <Link key={item.icon} to={item.navigate}>
          <Tooltip content={item.tooltip.replace("_", " ")} position="right" target={`.${item.tooltip}`} />
          <li
            className={` ${
              item.tooltip
            } flex h-14 cursor-pointer items-center justify-center transition-colors hover:text-sky-400 ${
              item.navigate !== "/" && pathname.includes(item.navigate.replace("./", "")) ? "text-sky-400" : ""
            }`}>
            <Icon fontSize={28} icon={item.icon} />
          </li>
        </Link>
      ))}

      <li className="mt-auto flex h-14 items-center">
        <Icon
          className={` ${isOwner ? "cursor-pointer hover:text-blue-300" : "text-zinc-600"}`}
          fontSize={28}
          icon="mdi:cog"
          onClick={() => {
            if (isOwner) navigate("./settings/project-settings");
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
        {isLoading ? null : <Icon className="newSectionButton text-white" fontSize={28} icon={IconEnum.add} />}
      </Button>
    </li>
  );
}

export default function Sidebar() {
  const { pathname } = useLocation();
  const theme = useAtomValue(ThemeAtom);
  return (
    <div className={`flex w-16 min-w-[4rem] flex-col border-r border-zinc-800 bg-${theme === "dark" ? "zinc" : "white"}-900`}>
      <nav className="flex flex-1 flex-col  overflow-y-auto">
        <ul className="flex flex-1 flex-col items-center">
          {pathname === "/" ? <SidebarDashBoardItems /> : <SidebarProjectItems items={navItems} pathname={pathname} />}
        </ul>
      </nav>
    </div>
  );
}
