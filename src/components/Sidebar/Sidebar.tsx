/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";

import { SidebarCollapseAtom } from "../../utils/Atoms/atoms";

const navItems = [
  {
    icon: "mdi:home",
    navigate: "/",
  },
  { icon: "ion:documents-outline", navigate: "documents" },
  { icon: "mdi:map-outline", navigate: "maps" },
  { icon: "ph:graph", navigate: "boards" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [sidebarToggle, setSidebarToggle] = useAtom(SidebarCollapseAtom);
  return (
    <div className="flex w-16 flex-col border-r border-zinc-800 bg-zinc-900">
      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col items-center">
          <li className="flex h-14 items-center">
            <Icon
              className="cursor-pointer hover:text-blue-300"
              fontSize={28}
              icon={`mdi:${sidebarToggle ? "menu-open" : "menu"}`}
              onClick={() => {
                setSidebarToggle(!sidebarToggle);
              }}
            />
          </li>
          {navItems.map((item) => (
            <li
              key={item.icon}
              className="flex h-14 cursor-pointer items-center justify-center transition-colors hover:text-sky-400"
              onClick={() => {
                navigate(item.navigate);
              }}>
              <Icon fontSize={28} icon={item.icon} />
            </li>
          ))}
          <li className="mt-auto h-14">
            <Icon fontSize={28} icon="mdi:cog" />
          </li>
        </ul>
      </nav>
    </div>
  );
}
