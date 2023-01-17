import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";

import { useCreateItem } from "../../CRUD/ItemsCRUD";
import { useBreakpoint } from "../../hooks/useMediaQuery";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import BaseTree from "./BaseTree";

export default function MapsTree() {
  const { project_id } = useParams();
  const [, setDrawer] = useAtom(DrawerAtom);
  const createMapMutation = useCreateItem("maps");
  const { isMd } = useBreakpoint();
  return (
    <div className="flex h-screen flex-1 flex-col">
      <div className="flex  items-center justify-between gap-y-2 gap-x-1 border-b border-zinc-600 pb-2 ">
        <Button
          className="p-button-outlined p-button-secondary w-full truncate"
          icon="pi pi-folder"
          label={isMd ? "" : "New Folder"}
          onClick={() => {
            createMapMutation?.mutate({
              folder: true,
              project_id: project_id as string,
              title: "New Folder",
            });
          }}
        />
        <Button
          className="p-button-outlined w-full truncate"
          icon="pi pi-map"
          iconPos="right"
          label={isMd ? "" : "New Map"}
          onClick={() => {
            setDrawer({
              ...DefaultDrawer,
              position: "right",
              show: true,
              type: "maps",
            });
          }}
        />
      </div>

      <BaseTree type="maps" />
    </div>
  );
}
