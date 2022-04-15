import React from "react";
import { Menubar } from "primereact/menubar";
import { logout } from "../../utils/supabaseUtils";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";
type Props = {};

export default function Navbar({}: Props) {
  const navigate = useNavigate();
  const end = () => {
    return (
      <div className="flex flex-nowrap">
        <Tooltip
          target=".settingsIcon"
          content="Project Settings"
          position="bottom"
        />
        <i
          className="pi pi-cog mr-3 cursor-pointer hover:text-primary settingsIcon"
          onClick={() => navigate("settings/documents-settings")}
        ></i>
        <i className="pi pi-user mr-3 cursor-pointer hover:text-primary"></i>
        <i
          className="pi pi-sign-out cursor-pointer hover:text-primary"
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
        ></i>
      </div>
    );
  };
  return <Menubar end={end} className="w-full border-noround" />;
}
