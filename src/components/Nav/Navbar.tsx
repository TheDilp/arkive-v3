import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Tooltip } from "primereact/tooltip";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetSingleProject } from "../../CRUD/ProjectCRUD";
import { DialogAtom, DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDialog, DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";

export default function Navbar() {
  const navigate = useNavigate();
  const { project_id } = useParams();
  const [, setDialog] = useAtom(DialogAtom);
  const [, setDrawer] = useAtom(DrawerAtom);
  const projectData = useGetSingleProject(project_id as string);
  function navbarShortcuts(e: KeyboardEvent) {
    if (e.ctrlKey && project_id) {
      if (e.key === "1") {
        e.preventDefault();
        e.stopPropagation();
        navigate("/");
      } else if (e.key === "2") {
        e.preventDefault();
        e.stopPropagation();
        navigate("./documents");
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
  }

  useEffect(() => {
    window.addEventListener("keydown", navbarShortcuts);
    return () => {
      window.removeEventListener("keydown", navbarShortcuts);
    };
  }, []);

  return (
    <div className="flex flex-nowrap border-b border-zinc-600 bg-zinc-800 py-2 shadow">
      <div className="flex w-full items-center gap-x-2 px-2">
        <Icon
          className="cursor-pointer hover:text-blue-300"
          fontSize={20}
          icon="mdi:home"
          onClick={async () => {
            navigate("/");
          }}
        />
        {project_id && (
          <>
            <Tooltip autoHide content="Documents" position="bottom" target=".documentsIcon" />{" "}
            <Tooltip autoHide content="Maps" position="bottom" target=".mapsIcon" />{" "}
            <Tooltip autoHide content="Boards" position="bottom" target=".boardsIcon" />
            <Tooltip autoHide content="Files" position="bottom" target=".filebrowserIcon" />
            <Icon
              className="documentsIcon cursor-pointer hover:text-blue-300"
              fontSize={20}
              icon="mdi:books"
              onClick={async () => {
                navigate("./documents");
              }}
            />
            <Icon
              className="mapsIcon cursor-pointer hover:text-blue-300"
              fontSize={20}
              icon="mdi:map-marker"
              onClick={async () => {
                navigate("./maps");
              }}
            />
            <Icon
              className="boardsIcon cursor-pointer hover:text-blue-300"
              fontSize={20}
              icon="mdi:draw"
              onClick={async () => {
                navigate("./boards");
              }}
            />
            {/* <Icon
              className="cursor-pointer hover:text-blue-300"
              fontSize={20}
              icon="mdi:chart-timeline-variant"
              onClick={async () => {
                navigate("./timelines");
              }}
            /> */}
            <span className="ml-auto flex items-center gap-x-2">
              <Icon
                className="cursor-pointer hover:text-blue-300"
                fontSize={20}
                icon="ion:search"
                onClick={async () => setDrawer({ ...DefaultDrawer, position: "right", show: true, type: "full_search" })}
              />
              <Icon
                className="fileBrowserIcon cursor-pointer hover:text-blue-300"
                fontSize={20}
                icon="ion:upload"
                onClick={async () => setDialog({ ...DefaultDialog, position: "top-right", show: true, type: "files" })}
              />
              <Icon
                className="cursor-pointer hover:text-blue-300"
                fontSize={20}
                icon="ion:images"
                onClick={async () => {
                  navigate("./filebrowser");
                }}
              />
              <Icon
                className="cursor-pointer hover:text-blue-300"
                fontSize={20}
                icon="mdi:cog"
                onClick={async () => {
                  navigate("./settings/project-settings");
                }}
              />
            </span>
          </>
        )}
      </div>
      {/* Use project title only if in project */}
      {project_id && (
        <div
          className="h-2rem align-items-start pointer-events-none fixed flex w-full overflow-hidden"
          style={{
            top: "0.25rem",
          }}>
          <h2 className="mx-auto my-0 font-Merriweather text-3xl">{projectData?.data?.title}</h2>
        </div>
      )}
    </div>
  );
}
