import { Menubar } from "primereact/menubar";
import { Tooltip } from "primereact/tooltip";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../../utils/supabaseUtils";
import NavSettingsButton from "./NavSettingsButton";

export default function Navbar() {
  const navigate = useNavigate();
  const { project_id } = useParams();
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
        {project_id && <NavSettingsButton />}
        <i
          className="pi pi-user mr-3 cursor-pointer hover:text-primary"
          onClick={async () => {
            navigate("/profile");
          }}
        ></i>
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
  return (
    <Menubar
      end={end}
      className="w-full border-noround border-x-none shadow-5"
    />
  );
}
