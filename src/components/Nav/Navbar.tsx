import { Icon } from "@iconify/react";
import { useIsMutating, useQueryClient } from "@tanstack/react-query";
import { getAuth, signOut } from "firebase/auth";
import { useAtom, useAtomValue } from "jotai";
import { ProgressSpinner } from "primereact/progressspinner";
import { useNavigate, useParams } from "react-router-dom";

import { DialogAtom, DrawerAtom, SidebarCollapseAtom, ThemeAtom, UserAtom } from "../../utils/Atoms/atoms";
import { DefaultDialog, DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import PageTitle from "../Title/PageTitle";
import DefaultTooltip from "../Tooltip/DefaultTooltip";
import { Tooltip } from "../Tooltip/Tooltip";
import RandomGenerator from "./RandomGenerator";

export default function Navbar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const [, setDialog] = useAtom(DialogAtom);
  const [, setDrawer] = useAtom(DrawerAtom);
  const [, setUserData] = useAtom(UserAtom);
  const theme = useAtomValue(ThemeAtom);

  const sidebarToggle = useAtomValue(SidebarCollapseAtom);
  const auth = getAuth();
  const mutationCount = useIsMutating();
  return (
    <div
      className={`flex h-14 min-h-[56px] w-full flex-nowrap items-center border-b border-zinc-800 ${
        theme === "dark" ? "bg-zinc-900" : "bg-white"
      } py-2 shadow`}>
      <div className="flex w-full items-center justify-center gap-x-2 px-2">
        {!sidebarToggle ? <PageTitle /> : null}
        <span className="ml-auto flex items-center gap-x-2">
          {project_id ? (
            <>
              {mutationCount > 0 ? (
                <div className="flex w-fit items-center">
                  <ProgressSpinner style={{ width: "2.5rem" }} />
                </div>
              ) : (
                <div className="rounded-full border p-0.5">
                  <Tooltip allowedPlacements={["bottom", "left"]} content={<DefaultTooltip>All saved.</DefaultTooltip>}>
                    <Icon color="lightgreen" icon="codicon:check-all" />
                  </Tooltip>
                </div>
              )}
              <Icon
                className="cursor-pointer hover:text-blue-300"
                fontSize={20}
                icon="ion:search"
                onClick={() =>
                  setDrawer({ ...DefaultDrawer, position: "right", drawerSize: "md", show: true, type: "full_search" })
                }
              />
              <Icon
                className="fileBrowserIcon cursor-pointer hover:text-blue-300"
                fontSize={20}
                icon="ion:upload"
                onClick={() => setDialog({ ...DefaultDialog, position: "top-right", show: true, type: "files" })}
              />
              <Tooltip allowedPlacements={["bottom-end"]} content={<RandomGenerator />} isClickable>
                <Icon className="cursor-pointer hover:text-blue-300" fontSize={20} icon="arcticons:reroll" />
              </Tooltip>
              <Icon
                className="cursor-pointer hover:text-blue-300"
                fontSize={20}
                icon="ph:user-fill"
                onClick={() => {
                  navigate(`/user/${auth.currentUser?.uid}`);
                }}
              />
              {/* <Icon
                className="cursor-pointer hover:text-blue-300"
                fontSize={20}
                icon={theme === "dark" ? "ph:moon" : "ph:sun-dim-light"}
                onClick={() => {
                  setItem("theme", theme === "dark" ? "light" : "dark");
                  setTheme(theme === "dark" ? "light" : "dark");
                }}
              /> */}
            </>
          ) : null}

          <Icon
            className="cursor-pointer hover:text-blue-300"
            fontSize={20}
            icon="mdi:log-out"
            onClick={() => {
              signOut(auth).then(() => {
                queryClient.clear();
                setUserData(null);
                window.location.href = "https://home.thearkive.app";
              });
            }}
          />
        </span>
      </div>
    </div>
  );
}
