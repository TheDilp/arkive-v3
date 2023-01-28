import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";

export default function SettingsSidebar() {
  const { pathname } = useLocation();
  return (
    <div className="flex flex-1 flex-col bg-zinc-900 p-4">
      <ul className="flex w-full flex-col gap-y-1 font-Lato text-sm">
        <Link
          className={`flex cursor-pointer items-center gap-x-4 rounded py-2 px-4  hover:text-white ${
            pathname.includes("project-settings") ? "bg-sky-700 text-white" : "text-zinc-500"
          }`}
          to="./settings/project-settings">
          <Icon fontSize={18} icon="mdi:cogs" />
          Project Settings
        </Link>
        <Link
          className={`flex cursor-pointer items-center gap-x-4 rounded py-2 px-4  hover:text-white ${
            pathname.includes("document-settings") ? "bg-sky-700 text-white" : "text-zinc-500"
          }`}
          to="./settings/document-settings">
          <Icon fontSize={18} icon="mdi:files" />
          Document Settings
        </Link>
        <Link
          className={`flex cursor-pointer items-center gap-x-4 rounded py-2 px-4  hover:text-white ${
            pathname.includes("map-settings") ? "bg-sky-700 text-white" : "text-zinc-500"
          }`}
          to="./settings/map-settings">
          <Icon fontSize={18} icon="mdi:map" />
          Map Settings
        </Link>
        <Link
          className={`flex cursor-pointer items-center gap-x-4 rounded py-2 px-4  hover:text-white ${
            pathname.includes("board-settings") ? "bg-sky-700 text-white" : "text-zinc-500"
          }`}
          to="./settings/board-settings">
          <Icon fontSize={18} icon="mdi:draw" />
          Board Settings
        </Link>
        <Link
          className={`flex cursor-pointer items-center gap-x-4 rounded py-2 px-4  hover:text-white ${
            pathname.includes("tags-settings") ? "bg-sky-700 text-white" : "text-zinc-500"
          }`}
          to="./settings/tags-settings">
          <Icon fontSize={18} icon="mdi:tags" />
          Tags
        </Link>
        <Link
          className={`flex cursor-pointer items-center gap-x-4 rounded py-2 px-4  hover:text-white ${
            pathname.includes("assets-settings") ? "bg-sky-700 text-white" : "text-zinc-500"
          }`}
          to="./settings/assets-settings">
          <Icon fontSize={18} icon="ion:images" />
          Assets
        </Link>
      </ul>
    </div>
  );
}
