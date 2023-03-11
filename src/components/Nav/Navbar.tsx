import { Icon } from "@iconify/react";
import { useIsMutating, useQueryClient } from "@tanstack/react-query";
import { getAuth, signOut } from "firebase/auth";
import { useAtom } from "jotai";
import { ProgressSpinner } from "primereact/progressspinner";
import { useNavigate, useParams } from "react-router-dom";

import { DialogAtom, DrawerAtom, UserAtom } from "../../utils/Atoms/atoms";
import { DefaultDialog, DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
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
  const auth = getAuth();
  const mutationCount = useIsMutating();
  return (
    <div className="flex h-14 min-h-[56px] w-full flex-nowrap items-center border-b border-zinc-800 bg-zinc-900 py-2 shadow">
      <div className="flex w-full items-center justify-center gap-x-2 px-2">
        <span className="ml-auto flex items-center gap-x-2">
          {project_id ? (
            <>
              {mutationCount > 0 ? (
                <div className="flex w-fit items-center">
                  <ProgressSpinner style={{ width: "2.5rem" }} />
                </div>
              ) : (
                <div className="rounded-full border p-1">
                  <Tooltip content={<DefaultTooltip>All saved.</DefaultTooltip>}>
                    <Icon color="lightgreen" icon="codicon:check-all" />
                  </Tooltip>
                </div>
              )}
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
                navigate("/auth/signin");
              });
            }}
          />
        </span>
      </div>
    </div>
  );
}
