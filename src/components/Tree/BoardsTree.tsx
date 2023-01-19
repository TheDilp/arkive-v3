import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";

import { useCreateItem } from "../../CRUD/ItemsCRUD";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { buttonLabelWithIcon } from "../../utils/transform";
import BaseTree from "./BaseTree";

export default function BoardsTree() {
  const { project_id } = useParams();
  const [, setDrawer] = useAtom(DrawerAtom);
  const createBoardMutation = useCreateItem("boards");

  return (
    <div className="flex h-screen flex-1 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-y-2 border-b border-zinc-600 pb-2 ">
        <Button
          className="p-button-outlined p-button-secondary w-full truncate"
          icon="pi pi-folder"
          label="New Folder"
          iconPos="right"
          onClick={() => {
            createBoardMutation?.mutate({
              folder: true,
              project_id: project_id as string,
              title: "New Folder",
            });
          }}
        />
        <Button
          className="p-button-outlined w-full truncate"
          onClick={() => {
            setDrawer({
              ...DefaultDrawer,
              position: "right",
              show: true,
              type: "boards",
            });
          }}>
          <div className="flex w-full items-center justify-center gap-x-1">
            <div className="w-full">New Board</div>
            <div className="ml-auto">
              <Icon className="" fontSize={20} icon="ph:graph" />
            </div>
          </div>
        </Button>
      </div>

      <BaseTree type="boards" />
    </div>
  );
}
