import { Icon } from "@iconify/react";
import { getAuth, signOut } from "firebase/auth";
import { useAtom } from "jotai";
import { useNavigate, useParams } from "react-router-dom";

import { DialogAtom, DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDialog, DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { Tooltip } from "../Tooltip/Tooltip";
import RandomGenerator from "./RandomGenerator";

export default function Navbar() {
  const navigate = useNavigate();
  const { project_id } = useParams();
  const [, setDialog] = useAtom(DialogAtom);
  const [, setDrawer] = useAtom(DrawerAtom);
  const auth = getAuth();

  return (
    <div className="flex h-14 min-h-[56px] w-full flex-nowrap items-center border-b border-zinc-800 bg-zinc-900 py-2 shadow">
      <div className="flex w-full items-center justify-center gap-x-2 px-2">
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
              <Tooltip allowedPlacements={["bottom-end"]} closeOnClick content={<RandomGenerator />} isClickable>
                <Icon className="cursor-pointer hover:text-blue-300" fontSize={20} icon="arcticons:reroll" />
              </Tooltip>
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
