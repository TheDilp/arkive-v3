import { Icon } from "@iconify/react";
import { getAuth, signOut } from "firebase/auth";
import { useAtom } from "jotai";
import { useNavigate, useParams } from "react-router-dom";

import { useGetSingleProject } from "../../CRUD/ProjectCRUD";
import { useBreakpoint } from "../../hooks/useMediaQuery";
import { DialogAtom, DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDialog, DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";

export default function Navbar() {
  const navigate = useNavigate();
  const { project_id } = useParams();
  const [, setDialog] = useAtom(DialogAtom);
  const [, setDrawer] = useAtom(DrawerAtom);
  const projectData = useGetSingleProject(project_id as string, !!project_id);
  const { isSm } = useBreakpoint();

  const auth = getAuth();

  return (
    <div className="min-h-8 flex h-[49px] flex-nowrap items-center border-b border-zinc-800 bg-zinc-900 py-2 shadow">
      <div className="flex w-full items-center justify-center gap-x-2 px-2">
        {/* Use project title only if in project */}
        {project_id && !isSm && (
          <div className="pointer-events-none sticky top-0 flex h-full flex-1 items-center justify-center">
            <h2 className="my-0 select-none font-Merriweather text-3xl">{projectData?.data?.title}</h2>
          </div>
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

          <Icon
            className="cursor-pointer hover:text-blue-300"
            fontSize={20}
            icon="mdi:log-out"
            onClick={async () => {
              await signOut(auth);
              navigate("/auth/signin");
            }}
          />
        </span>
      </div>
    </div>
  );
}
