import { Icon } from "@iconify/react";
import { Menubar } from "primereact/menubar";
import { Tooltip } from "primereact/tooltip";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../../utils/supabaseUtils";
import NavbarTitle from "./NavbarTitle";
import NavSettingsButton from "./NavSettingsButton";

export default function Navbar() {
  const navigate = useNavigate();
  const { project_id } = useParams();

  const start = () => {
    return (
      <div className="flex flex-nowrap py-2 align-items-start pl-2">
        {project_id && (
          <div className="flex align-items-center">
            <Tooltip
              target=".wikiIcon"
              content="Project Wiki"
              position="right"
            />{" "}
            <Tooltip
              target=".mapsIcon"
              content="Project Maps"
              position="right"
            />{" "}
            <Tooltip
              target=".boardsIcon"
              content="Project Boards"
              position="right"
            />
            <i
              className="pi pi-book mr-3 hover:text-primary cursor-pointer wikiIcon"
              onClick={async () => {
                navigate("./wiki");
              }}
            ></i>
            <i
              className="pi pi-map mr-3 hover:text-primary cursor-pointer mapsIcon"
              onClick={async () => {
                navigate("./maps");
              }}
            ></i>
            <Icon
              className="hover:text-primary cursor-pointer boardsIcon"
              icon="mdi:family-tree"
              fontSize={18}
              onClick={async () => {
                navigate("./boards");
              }}
            />
          </div>
        )}
        {/* Use project title only if in project */}
        {project_id && <NavbarTitle />}
      </div>
    );
  };
  const end = () => {
    return (
      <div className="flex flex-nowrap pr-2">
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
      className="w-full border-noround border-x-none shadow-5 p-0"
    />
  );
}
