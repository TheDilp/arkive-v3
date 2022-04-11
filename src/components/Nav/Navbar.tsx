import React from "react";
import { Menubar } from "primereact/menubar";
import { logout } from "../../utils/supabaseUtils";
import { useNavigate, useParams } from "react-router-dom";
type Props = {};

export default function Navbar({}: Props) {
  const navigate = useNavigate();
  const end = () => {
    return (
      <div className="flex flex-nowrap">
        <i
          className="pi pi-cog mr-3 cursor-pointer hover:text-primary"
          onClick={() => navigate("settings")}
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
