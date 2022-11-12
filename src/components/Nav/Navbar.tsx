import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleProject } from "../../CRUD/ProjectCRUD";

export default function Navbar() {
  const navigate = useNavigate();
  const { project_id } = useParams();
  const [uploadDialog, setUploadDialog] = useState(false);
  const [search, setSearch] = useState<string | null>(null);
  const projectData = useGetSingleProject(project_id as string);

  function navbarShortcuts(e) {
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
  }

  useEffect(() => {
    window.addEventListener("keydown", navbarShortcuts);
    return () => {
      window.removeEventListener("keydown", navbarShortcuts);
    };
  }, []);

  return (
    <div className="flex py-2 border-b shadow border-zinc-600 bg-zinc-800 flex-nowrap">
      <div className="w-full flex items-center px-2 gap-x-2">
        <Icon
          className="cursor-pointer hover:text-blue-300"
          icon="mdi:home"
          fontSize={20}
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
              icon="mdi:books"
              fontSize={20}
              onClick={async () => {
                navigate("./wiki");
              }}
            />
            <Icon
              className="cursor-pointer hover:text-blue-300 "
              icon="mdi:map-marker"
              fontSize={20}
              onClick={async () => {
                navigate("./maps");
              }}
            />

            <Icon
              className="cursor-pointer hover:text-blue-300"
              icon="mdi:draw"
              fontSize={20}
              onClick={async () => {
                navigate("./boards");
              }}
            />
            <Icon
              className="cursor-pointer hover:text-blue-300"
              icon="mdi:chart-timeline-variant"
              fontSize={20}
              onClick={async () => {
                navigate("./timelines");
              }}
            />

            <span className="ml-auto">
              <Icon
                className="cursor-pointer hover:text-blue-300"
                icon="ion:images"
                fontSize={20}
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
          className="w-full flex fixed overflow-hidden pointer-events-none h-2rem align-items-start"
          style={{
            top: "0.25rem",
          }}>
          <h2 className="mx-auto my-0 text-3xl font-Merriweather">
            {projectData?.data?.title}
          </h2>
        </div>
      )}
    </div>
  );
}
