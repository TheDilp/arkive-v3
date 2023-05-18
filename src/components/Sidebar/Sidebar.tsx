/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Icon } from "@iconify/react";
import { useAtom, useAtomValue } from "jotai";
import { Button } from "primereact/button";
import { Tooltip as PrimeTooltip } from "primereact/tooltip";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useCreateProject } from "../../CRUD/ProjectCRUD";
import { useBreakpoint } from "../../hooks/useMediaQuery";
import { NavItemType, PermissionCategoriesType } from "../../types/generalTypes";
import { PermissionAtom, SidebarCollapseAtom, ThemeAtom } from "../../utils/Atoms/atoms";
import { IconEnum } from "../../utils/DefaultValues/GeneralDefaults";
import { setItem } from "../../utils/storage";
import { checkIfCategoryAllowed, checkIfOwner, navItems } from "../../utils/uiUtils";

function SidebarProjectItems({ items, pathname }: { items: NavItemType[]; pathname: string }) {
  const { isLg } = useBreakpoint();
  const [sidebarToggle, setSidebarToggle] = useAtom(SidebarCollapseAtom);
  const permission = useAtomValue(PermissionAtom);
  const navigate = useNavigate();
  const isOwner = checkIfOwner(permission);
  if (!permission) return null;
  return (
    <>
      {isLg ? (
        <li className="flex h-14 items-center">
          <Icon
            className="cursor-pointer hover:text-blue-300"
            fontSize={28}
            icon={sidebarToggle ? IconEnum.menu_open : IconEnum.menu}
            onClick={() => {
              setSidebarToggle(!sidebarToggle);
              setItem("sidebarState", !sidebarToggle);
            }}
          />
        </li>
      ) : null}
      {items.map((item) => {
        const categoryPermission = checkIfCategoryAllowed(permission, item.tooltip.toLowerCase() as PermissionCategoriesType);
        return (
          <Link
            key={item.icon}
            className={`mx-4 lg:mx-0 ${categoryPermission ? "cursor-pointer" : "cursor-default"}`}
            to={categoryPermission ? item.navigate : "#"}>
            <PrimeTooltip content={item.tooltip.replace("_", " ")} position="right" target={`.${item.tooltip}`} />
            <li
              className={`${item.tooltip} flex h-14 items-center justify-center transition-colors  ${
                categoryPermission ? "hover:text-sky-400" : "text-zinc-400 hover:text-zinc-700"
              } ${item.navigate !== "/" && pathname.includes(item.navigate.replace("./", "")) ? "text-sky-400 " : ""}
              ${categoryPermission ? "" : "text-zinc-700"}
            
            `}>
              <Icon fontSize={28} icon={item.icon} />
            </li>
          </Link>
        );
      })}

      {permission !== "owner" ? null : (
        <li className="mx-4 ml-auto flex h-14 items-center lg:mx-0 lg:ml-0 lg:mt-auto">
          <Icon
            className={`${isOwner ? "cursor-pointer hover:text-blue-300" : "text-zinc-600"}`}
            fontSize={28}
            icon="mdi:cog"
            onClick={() => {
              if (isOwner) navigate("./settings/project-settings");
            }}
          />
        </li>
      )}
    </>
  );
}

export function DashboardSidebar() {
  const { mutate: createProjectMutation, isLoading } = useCreateProject();

  return (
    <div className="flex w-full flex-row items-center  bg-zinc-900 lg:h-full lg:w-16 lg:flex-col">
      <Button
        className="p-button-text p-button-secondary"
        loading={isLoading}
        onClick={() => createProjectMutation()}
        tooltip="Create new project"
        tooltipOptions={{ position: "right" }}>
        {isLoading ? null : <Icon className="newSectionButton text-white" fontSize={28} icon={IconEnum.add} />}
      </Button>
    </div>
  );
}

export default function Sidebar() {
  const { pathname } = useLocation();
  const theme = useAtomValue(ThemeAtom);
  return (
    <div
      className={`flex w-full max-w-full flex-col overflow-x-hidden overflow-y-hidden border-r border-zinc-800 lg:w-16 lg:min-w-[4rem] bg-${
        theme === "dark" ? "zinc" : "white"
      }-900`}>
      <nav className="flex h-48 flex-1 flex-col overflow-x-hidden overflow-y-hidden lg:h-full lg:overflow-y-auto lg:overflow-x-hidden">
        <ul className="flex w-screen overflow-x-auto lg:w-full lg:flex-1 lg:flex-col lg:items-center lg:justify-start lg:overflow-x-hidden lg:px-4">
          <SidebarProjectItems items={navItems} pathname={pathname} />
        </ul>
      </nav>
    </div>
  );
}
