import { Icon } from "@iconify/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import NavbarTitle from "./NavbarTitle";
// import NavSettingsButton from "./NavSettingsButton";
// import Quickupload from "./Quickupload";
// import GlobalSearch from "./GlobalSearch";

export default function Navbar() {
  const navigate = useNavigate();
  const { project_id } = useParams();
  const [uploadDialog, setUploadDialog] = useState(false);
  const [search, setSearch] = useState<string | null>(null);

  const start = () => {
    return (
      <div className="flex items-start py-2 pl-2 flex-nowrap">
        <div className="flex items-center">
          <i
            className="mr-3 cursor-pointer pi pi-home hover:text-primary"
            onClick={() => navigate("/home")}
          ></i>
          {project_id && (
            <>
              {/* <Tooltip
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
              /> */}
              <i
                className="mr-3 cursor-pointer pi pi-book hover:text-primary wikiIcon"
                onClick={async () => {
                  navigate("./wiki");
                }}
              ></i>
              <i
                className="cursor-pointer pi pi-map hover:text-primary mapsIcon"
                onClick={async () => {
                  navigate("./maps");
                }}
              ></i>
              <span className="ml-2 mr-2 pl-1 boardsIcon">
                <Icon
                  className="cursor-pointer hover:text-primary "
                  icon="mdi:draw"
                  fontSize={20}
                  onClick={async () => {
                    navigate("./boards");
                  }}
                />
              </span>
              <span className="mr-2 timelineIcon">
                <Icon
                  className="cursor-pointer hover:text-primary"
                  icon="mdi:chart-timeline-variant"
                  fontSize={22}
                  onClick={async () => {
                    navigate("./timelines");
                  }}
                />
              </span>
              <span className="">
                <i
                  className="cursor-pointer pi pi-image hover:text-primary filebrowserIcon"
                  onClick={async () => {
                    navigate("./filebrowser");
                  }}
                ></i>
              </span>
            </>
          )}
        </div>
        {/* Use project title only if in project */}
        {/* {project_id && <NavbarTitle />} */}
      </div>
    );
  };
  const end = () => {
    return (
      <div className="flex items-center py-2 pr-2 flex-nowrap">
        {/* <Tooltip
          target=".settingsIcon"
          content="Project Settings"
          position="bottom"
        />
        <Tooltip
          target=".quickUpload"
          content="Quick Upload"
          position="bottom"
        /> */}

        {project_id && (
          <>
            <i
              className="mr-3 cursor-pointer pi pi-search z-2 hover:text-primary"
              onClick={() => setSearch("")}
            ></i>
            <i
              className="mr-3 cursor-pointer pi pi-upload hover:text-primary quickUpload"
              onClick={() => setUploadDialog(true)}
            ></i>
          </>
        )}
        {/* {project_id && <NavSettingsButton />} */}
        <i
          className="mr-3 cursor-pointer pi pi-user hover:text-primary"
          onClick={async () => {
            navigate("/profile");
          }}
        ></i>
        <i
          className="cursor-pointer pi pi-sign-out hover:text-primary"
          onClick={async () => {
            navigate("/auth");
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
    <div className="flex py-2 pl-2 border-b shadow border-zinc-600 bg-zinc-800 flex-nowrap">
      <div className="flex align-items-center">
        <i
          className="mr-3 cursor-pointer pi pi-home hover:text-primary"
          onClick={() => navigate("/home")}
        ></i>
        {project_id && (
          <>
            {/* <Tooltip
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
              /> */}
            <i
              className="mr-3 cursor-pointer pi pi-book hover:text-primary wikiIcon"
              onClick={async () => {
                navigate("./wiki");
              }}
            ></i>
            <i
              className="cursor-pointer pi pi-map hover:text-primary mapsIcon"
              onClick={async () => {
                navigate("./maps");
              }}
            ></i>
            <span className="ml-2 mr-2 pl-1 boardsIcon">
              <Icon
                className="cursor-pointer hover:text-primary "
                icon="mdi:draw"
                fontSize={20}
                onClick={async () => {
                  navigate("./boards");
                }}
              />
            </span>
            <span className="mr-2 timelineIcon">
              <Icon
                className="cursor-pointer hover:text-primary"
                icon="mdi:chart-timeline-variant"
                fontSize={22}
                onClick={async () => {
                  navigate("./timelines");
                }}
              />
            </span>
            <span className="">
              <i
                className="cursor-pointer pi pi-image hover:text-primary filebrowserIcon"
                onClick={async () => {
                  navigate("./filebrowser");
                }}
              ></i>
            </span>
          </>
        )}
      </div>
      {/* Use project title only if in project */}
      {/* {project_id && <NavbarTitle />} */}
    </div>
  );
}
