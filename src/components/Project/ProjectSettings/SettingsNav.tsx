import { Icon } from "@iconify/react";
import { Link, useParams } from "react-router-dom";

export default function SettingsNav() {
  const { setting } = useParams();
  return (
    <ul className="list-none Lato px-1">
      <Link
        to="../settings/project-settings"
        className={`no-underline text-gray-400 hover:text-white ${
          setting === "project-settings" && "text-white"
        }`}
      >
        <li
          className={`w-15rem text-gray-400 cursor-pointer py-2 pl-1 my-1 hover:text-white ${
            setting === "project-settings" && "text-white bg-blue-700 "
          }`}
          style={{
            borderRadius: "0.35rem",
          }}
        >
          <i className="pi pi-fw pi-cog mr-2"></i>
          Project Settings
        </li>
      </Link>

      <Link
        to="../settings/board-settings"
        className={`no-underline text-gray-400 hover:text-white ${
          setting === "project-theme" && "text-white"
        }`}
      >
        <li
          className={`w-15rem cursor-pointer py-2 pl-1 my-1 hover:text-white ${
            setting === "project-theme" && "text-white bg-blue-700 "
          }`}
          style={{
            borderRadius: "0.35rem",
          }}
        >
          <Icon
            className="hover:text-primary cursor-pointer "
            icon="mdi:draw"
            fontSize={20}
          />
          Board Settings
        </li>
      </Link>
      <Link
        to="../settings/documents-settings"
        className={`no-underline text-gray-400 hover:text-white ${
          setting === "documents-settings" && "text-white"
        }`}
      >
        <li
          className={`w-15rem text-gray-400 cursor-pointer py-2 pl-1 my-1 hover:text-white ${
            setting === "documents-settings" && "text-white bg-blue-700"
          }`}
          style={{
            borderRadius: "0.35rem",
          }}
        >
          <i className="pi pi-fw pi-file mr-2"></i>
          Documents Settings
        </li>
      </Link>
    </ul>
  );
}
