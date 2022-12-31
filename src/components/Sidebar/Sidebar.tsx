import { Icon } from "@iconify/react";
import { TabPanel, TabView } from "primereact/tabview";
import { Link, useLocation } from "react-router-dom";

import BoardsTree from "../Tree/BoardsTree";
import DocumentsTree from "../Tree/DocumentsTree";
import MapsTree from "../Tree/MapsTree";
import TemplatesTree from "../Tree/TemplatesTree";

export default function Sidebar() {
  const { pathname } = useLocation();
  if (pathname.includes("documents"))
    return (
      <div className="flex flex-1 flex-col">
        <TabView className="flex flex-1 flex-col" renderActiveOnly>
          <TabPanel className="flex h-full w-full flex-1 flex-col" header="Documents">
            <DocumentsTree />
          </TabPanel>
          <TabPanel className="flex h-full w-full flex-1 flex-col" header="Templates">
            <TemplatesTree />
          </TabPanel>
        </TabView>
      </div>
    );
  if (pathname.includes("maps"))
    return (
      <div className="flex h-full flex-1 flex-col bg-zinc-800 p-4">
        <MapsTree />
      </div>
    );
  if (pathname.includes("boards"))
    return (
      <div className="flex flex-1 flex-col bg-zinc-800 p-4">
        <BoardsTree />
      </div>
    );

  if (pathname.includes("timelines")) return <div className="flex flex-1 flex-col bg-zinc-800">TIMELINES</div>;
  if (pathname.includes("settings"))
    return (
      <div className="flex flex-1 flex-col bg-zinc-800 p-4">
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
              pathname.includes("tags") ? "bg-sky-700 text-white" : "text-zinc-500"
            }`}
            to="./settings/tags">
            <Icon fontSize={18} icon="mdi:tags" />
            Tags
          </Link>
        </ul>
      </div>
    );
  return null;
}
