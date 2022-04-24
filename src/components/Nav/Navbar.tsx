import { Icon } from "@iconify/react";
import { Menubar } from "primereact/menubar";
import { Tooltip } from "primereact/tooltip";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../../utils/supabaseUtils";
import NavSettingsButton from "./NavSettingsButton";

export default function Navbar() {
  const navigate = useNavigate();
  const { project_id } = useParams();
  const start = () => {
    return (
      <div className="flex flex-nowrap">
        {project_id && (
          <div className="flex align-items-center">
            <i
              className="pi pi-book mr-3 hover:text-primary cursor-pointer"
              onClick={async () => {
                navigate("./wiki");
              }}
            ></i>
            <i
              className="pi pi-map mr-3 hover:text-primary cursor-pointer"
              onClick={async () => {
                navigate("./maps");
              }}
            ></i>
            <Icon
              className="hover:text-primary cursor-pointer"
              icon="mdi:family-tree"
              fontSize={18}
              onClick={async () => {
                navigate("./boards");
              }}
            />
          </div>
        )}
      </div>
    );
  };
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
      start={start}
      end={end}
      className="w-full border-noround border-x-none shadow-5"
    />
  );
}
