import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetSingleProject } from "../../CRUD/ProjectCRUD";
import { DialogAtom } from "../../utils/Atoms/atoms";
import { DefaultDialog } from "../../utils/DefaultValues/DrawerDialogDefaults";

export default function Navbar() {
  const navigate = useNavigate();
  const { project_id } = useParams();
  const [, setDialog] = useAtom(DialogAtom);
  // const [search, setSearch] = useState<string | null>(null);
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
            <Icon
              className="cursor-pointer hover:text-blue-300 "
              fontSize={20}
              icon="mdi:books"
              onClick={async () => {
                navigate("./documents");
              }}
            />
            <Icon
              className="cursor-pointer hover:text-blue-300 "
              fontSize={20}
              icon="mdi:map-marker"
              onClick={async () => {
                navigate("./maps");
              }}
            />

            <Icon
              className="cursor-pointer hover:text-blue-300"
              fontSize={20}
              icon="mdi:draw"
              onClick={async () => {
                navigate("./boards");
              }}
            />
            <Icon
              className="cursor-pointer hover:text-blue-300"
              fontSize={20}
              icon="mdi:chart-timeline-variant"
              onClick={async () => {
                navigate("./timelines");
              }}
            />

            <span className="ml-auto flex items-center gap-x-2">
              <Icon
                className="cursor-pointer hover:text-blue-300"
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
