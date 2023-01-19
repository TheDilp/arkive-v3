import { useAuthorizer } from "@authorizerdev/authorizer-react";
import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Tooltip } from "primereact/tooltip";
import { useNavigate, useParams } from "react-router-dom";

import { useGetSingleProject } from "../../CRUD/ProjectCRUD";
import { useBreakpoint } from "../../hooks/useMediaQuery";
import { DialogAtom, DrawerAtom, SidebarCollapseAtom } from "../../utils/Atoms/atoms";
import { DefaultDialog, DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";

export default function Navbar() {
  const navigate = useNavigate();
  const { project_id } = useParams();
  const [, setDialog] = useAtom(DialogAtom);
  const [, setDrawer] = useAtom(DrawerAtom);
  const [sidebarToggle, setSidebarToggle] = useAtom(SidebarCollapseAtom);
  const projectData = useGetSingleProject(project_id as string, !!project_id);
  const { isSm } = useBreakpoint();

  const { logout } = useAuthorizer();

  return (
    <div className="min-h-8 flex h-8 flex-nowrap border-b border-zinc-600 bg-zinc-800 py-2 shadow">
      <div className="flex w-full items-center gap-x-2 px-2">
        {project_id ? (
          <>
            <Icon
              className="cursor-pointer hover:text-blue-300"
              fontSize={20}
              icon={`mdi:${sidebarToggle ? "menu-open" : "menu"}`}
              onClick={() => {
                setSidebarToggle(!sidebarToggle);
              }}
            />
            <Icon
              className="cursor-pointer hover:text-blue-300"
              fontSize={20}
              icon="mdi:home"
              onClick={async () => {
                navigate("/");
              }}
            />
          </>
        ) : null}

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
              onClick={() => {
                navigate("./maps");
              }}
            />
            <Icon
              className="boardsIcon cursor-pointer hover:text-blue-300"
              fontSize={20}
              icon="mdi:draw"
              onClick={() => {
                navigate("./boards");
              }}
            />
          </>
        )}
        <span className="ml-auto flex items-center gap-x-2">
          {project_id ? (
            <>
              <Icon
                className="cursor-pointer hover:text-blue-300"
                fontSize={20}
                icon="ion:search"
                onClick={() => setDrawer({ ...DefaultDrawer, position: "right", show: true, type: "full_search" })}
              />
              <Icon
                className="fileBrowserIcon cursor-pointer hover:text-blue-300"
                fontSize={20}
                icon="ion:upload"
                onClick={() => setDialog({ ...DefaultDialog, position: "top-right", show: true, type: "files" })}
              />
              <Icon
                className="cursor-pointer hover:text-blue-300"
                fontSize={20}
                icon="mdi:cog"
                onClick={() => {
                  navigate("./settings/project-settings");
                }}
              />
            </>
          ) : null}

          <Icon className="cursor-pointer hover:text-blue-300" fontSize={20} icon="mdi:log-out" onClick={() => logout()} />
        </span>
      </div>
      {/* Use project title only if in project */}
      {project_id && !isSm && (
        <div
          className="h-2rem align-items-start pointer-events-none fixed flex w-full overflow-hidden"
          style={{
            top: "0.25rem",
          }}>
          <h2 className="mx-auto my-0 select-none font-Merriweather text-3xl">{projectData?.data?.title}</h2>
        </div>
      )}
    </div>
  );
}
