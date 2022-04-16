import React from "react";
import { Link, useParams } from "react-router-dom";

type Props = {};

export default function SettingsNav({}: Props) {
  const { setting } = useParams();
  return (
    <ul className="list-none Lato px-1">
      <li
        className={`w-15rem text-gray-400 cursor-pointer py-2 pl-1 my-1 hover:text-white ${
          setting === "project-settings" && "text-white bg-blue-700 "
        }`}
        style={{
          borderRadius: "0.35rem",
        }}
      >
        <Link
          to="../settings/project-settings"
          className={`no-underline text-gray-400 hover:text-white ${
            setting === "project-settings" && "text-white"
          }`}
        >
          <i className="pi pi-fw pi-cog mr-2"></i>
          ProjectSettings
        </Link>
      </li>

      <li
        className={`w-15rem cursor-pointer py-2 pl-1 my-1 hover:text-white ${
          setting === "project-theme" && "text-white bg-blue-700 "
        }`}
        style={{
          borderRadius: "0.35rem",
        }}
      >
        <Link
          to="../settings/project-theme"
          className={`no-underline text-gray-400 hover:text-white ${
            setting === "project-theme" && "text-white"
          }`}
        >
          <i className="pi pi-fw pi-palette mr-2"></i>
          Project Theme
        </Link>
      </li>
      <li
        className={`w-15rem text-gray-400 cursor-pointer py-2 pl-1 my-1 hover:text-white ${
          setting === "documents-settings" && "text-white bg-blue-700"
        }`}
        style={{
          borderRadius: "0.35rem",
        }}
      >
        <Link
          to="../settings/documents-settings"
          className={`no-underline text-gray-400 hover:text-white ${
            setting === "documents-settings" && "text-white"
          }`}
        >
          <i className="pi pi-fw pi-file mr-2"></i>
          Documents Settings
        </Link>
      </li>
    </ul>
  );
}