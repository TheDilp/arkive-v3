import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";

import { settingsItems } from "../../../utils/uiUtils";

export default function SettingsSidebar() {
  const { pathname } = useLocation();
  return (
    <div className="flex flex-1 flex-col bg-zinc-900 p-4">
      <h2 className="h-[3.25rem] text-center font-Merriweather text-2xl">Settings</h2>

      <ul className=" flex w-full flex-col gap-y-1 font-Lato text-sm">
        {settingsItems.map((item) => (
          <li key={item.title}>
            <Link
              className={`flex cursor-pointer items-center gap-x-4 rounded py-2 px-4  hover:text-white ${
                pathname.includes(item.navigate.replace("./", "")) ? "bg-sky-700 text-white" : "text-zinc-500"
              }`}
              to={item.navigate}>
              <Icon fontSize={18} icon={item.icon} />
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
