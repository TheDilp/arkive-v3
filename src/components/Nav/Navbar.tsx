import { Icon } from "@iconify/react";
import { Menubar } from "primereact/menubar";
import { Tooltip } from "primereact/tooltip";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../../utils/supabaseUtils";
import { MediaQueryContext } from "../Context/MediaQueryContext";
import { SidebarContext } from "../Context/SidebarContext";
import NavbarTitle from "./NavbarTitle";
import NavSettingsButton from "./NavSettingsButton";
import Quickupload from "./Quickupload";
import SearchDialog from "./SearchDialog";

export default function Navbar() {
  const navigate = useNavigate();
  const { project_id } = useParams();
  const { setSidebar } = useContext(SidebarContext);
  const { isTabletOrMobile } = useContext(MediaQueryContext);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [search, setSearch] = useState<string | null>(null);

  const start = () => {
    return (
      <div className="flex flex-nowrap py-2 align-items-start pl-2">
        <div className="flex align-items-center">
          {isTabletOrMobile && (
            <i
              className="pi pi-bars mr-3 cursor-pointer hover:text-primary sidebarBars"
              onClick={() => setSidebar(true)}
            ></i>
          )}
          <i
            className="pi pi-home mr-3 cursor-pointer hover:text-primary"
            onClick={() => navigate("/home")}
          ></i>
          {project_id && (
            <>
              <Tooltip
                target=".wikiIcon"
                content="Project Wiki"
                position="bottom"
                autoHide
              />{" "}
              <Tooltip
                target=".mapsIcon"
                content="Project Maps"
                position="bottom"
                autoHide
              />{" "}
              <Tooltip
                target=".boardsIcon"
                content="Project Boards"
                position="bottom"
                autoHide
              />
              <Tooltip
                target=".timelineIcon"
                content="Timelines"
                position="bottom"
                autoHide
              />
              <Tooltip
                target=".filebrowserIcon"
                content="Project Files"
                position="bottom"
                autoHide
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
              <span className="boardsIcon mr-1">
                <Icon
                  className="hover:text-primary cursor-pointer "
                  icon="mdi:draw"
                  fontSize={20}
                  onClick={async () => {
                    navigate("./boards");
                  }}
                />
              </span>
              <span className="timelineIcon mr-2">
                <Icon
                  className="hover:text-primary cursor-pointer"
                  icon="mdi:chart-timeline-variant"
                  fontSize={22}
                  onClick={async () => {
                    navigate("./timelines");
                  }}
                />
              </span>
              <i
                className="pi pi-image hover:text-primary cursor-pointer filebrowserIcon"
                onClick={async () => {
                  navigate("./filebrowser");
                }}
              ></i>
            </>
          )}
        </div>
        {/* Use project title only if in project */}
        {project_id && !isTabletOrMobile && <NavbarTitle />}
      </div>
    );
  };
  const end = () => {
    return (
      <div className="flex flex-nowrap pr-2 py-2 align-items-center">
        <Tooltip
          target=".settingsIcon"
          content="Project Settings"
          position="bottom"
        />
        <Tooltip
          target=".quickUpload"
          content="Quick Upload"
          position="bottom"
        />

        {project_id && (
          <>
            <i
              className="pi pi-search z-2 mr-3 cursor-pointer hover:text-primary"
              onClick={() => setSearch("")}
            ></i>
            <i
              className="pi pi-upload mr-3 cursor-pointer hover:text-primary quickUpload"
              onClick={() => setUploadDialog(true)}
            ></i>
          </>
        )}
        {project_id && <NavSettingsButton />}
        {/* <i
          className="pi pi-user mr-3 cursor-pointer hover:text-primary"
          onClick={async () => {
            navigate("/profile");
          }}
        ></i> */}
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

  useEffect(() => {
    window.addEventListener("keydown", function (e) {
      if (e.ctrlKey && project_id) {
        if (e.key === "1") {
          e.preventDefault();
          e.stopPropagation();
          navigate("/");
        } else if (e.key === "2") {
          e.preventDefault();
          e.stopPropagation();
          navigate("./wiki");
        } else if (e.key === "3") {
          e.preventDefault();
          e.stopPropagation();
          navigate("./maps");
        } else if (e.key === "4") {
          e.preventDefault();
          e.stopPropagation();
          navigate("./boards");
        }
      }
    });
    return () => {
      window.removeEventListener("keydown", function (e) {});
    };
  }, []);

  return (
    <>
      {project_id && (
        <>
          <Quickupload
            uploadDialog={uploadDialog}
            setUploadDialog={setUploadDialog}
          />
          <SearchDialog search={search} setSearch={setSearch} />{" "}
        </>
      )}
      <Menubar
        start={start}
        end={end}
        className="w-full border-noround border-x-none shadow-5 p-0 navbarMenu"
      />
    </>
  );
}
