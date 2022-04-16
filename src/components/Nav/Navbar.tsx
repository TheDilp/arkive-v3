import { Menubar } from "primereact/menubar";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/supabaseUtils";

export default function Navbar() {
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
          className="pi pi-home mr-3 cursor-pointer hover:text-primary"
          onClick={() => navigate("/")}
        ></i>
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
