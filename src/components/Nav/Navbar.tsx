import { UserButton } from "@clerk/clerk-react";
import { Icon } from "@iconify/react";
import { useIsMutating } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ProgressSpinner } from "primereact/progressspinner";
import { useLocation, useParams } from "react-router-dom";

import { useBreakpoint } from "../../hooks/useMediaQuery";
import { DialogAtom, DrawerAtom, RoleAtom, SidebarCollapseAtom, ThemeAtom } from "../../utils/Atoms/atoms";
import { DefaultDialog, DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { setItem } from "../../utils/storage";
import PageTitle from "../Title/PageTitle";
import DefaultTooltip from "../Tooltip/DefaultTooltip";
import { Tooltip } from "../Tooltip/Tooltip";
import RandomGenerator from "./RandomGenerator";

export default function Navbar() {
  const { isLg } = useBreakpoint();
  const { project_id } = useParams();
  const { pathname } = useLocation();
  const setDialog = useSetAtom(DialogAtom);
  const setDrawer = useSetAtom(DrawerAtom);
  const theme = useAtomValue(ThemeAtom);
  const UserRole = useAtomValue(RoleAtom);
  const [sidebarToggle, setSidebarToggle] = useAtom(SidebarCollapseAtom);
  const mutationCount = useIsMutating();

  return (
    <div
      className={`flex h-14 min-h-[56px] w-full flex-nowrap items-center border-b border-zinc-800 ${
        theme === "dark" ? "bg-zinc-900" : "bg-white"
      } py-2 shadow`}>
      <div className="flex w-full items-center justify-center gap-x-2 px-2">
        {!isLg && pathname !== "/" ? (
          <div className="min-w-18 w-18 flex h-14 items-center">
            <Icon
              className="cursor-pointer hover:text-blue-300"
              fontSize={28}
              icon={`mdi:${sidebarToggle ? "menu-open" : "menu"}`}
              onClick={() => {
                setSidebarToggle(!sidebarToggle);
                setItem("sidebarState", !sidebarToggle);
              }}
            />
          </div>
        ) : null}
        {!sidebarToggle ? <PageTitle /> : null}
        <span className="ml-auto flex items-center gap-x-2">
          {project_id ? (
            <>
              {mutationCount > 0 ? (
                <div className="flex w-fit items-center">
                  <ProgressSpinner style={{ width: "2.5rem" }} />
                </div>
              ) : (
                <div className="rounded-full border border-zinc-600 p-0.5">
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
                className={`fileBrowserIcon ${
                  UserRole?.is_owner || UserRole?.upload_assets
                    ? "cursor-pointer hover:text-blue-300"
                    : "cursor-not-allowed text-zinc-600"
                }`}
                fontSize={20}
                icon="ion:upload"
                onClick={() => {
                  if (UserRole?.is_owner || UserRole?.upload_assets)
                    setDialog({ ...DefaultDialog, position: "top-right", show: true, type: "files" });
                }}
              />
              <Tooltip allowedPlacements={["bottom-end"]} content={<RandomGenerator />} isClickable>
                <Icon className="cursor-pointer hover:text-blue-300" fontSize={20} icon="arcticons:reroll" />
              </Tooltip>
            </>
          ) : null}

          <UserButton />
        </span>
      </div>
    </div>
  );
}
