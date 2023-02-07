import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";

import { useCreateItem } from "../../CRUD/ItemsCRUD";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { getItemIconForTree, getItemNameForTree } from "../../utils/transform";
import BaseTree from "./BaseTree";

type Props = {
  type: AvailableItemTypes;
};

export default function ItemsTree({ type }: Props) {
  const { project_id } = useParams();
  const [, setDrawer] = useAtom(DrawerAtom);
  const createItemMutation = useCreateItem<AllItemsType>(type);
  const itemName = getItemNameForTree(type);
  return (
    <div className="flex h-screen flex-1 flex-col">
      <h2 className="h-8 text-center font-Merriweather text-2xl capitalize">{type === "boards" ? "graphs" : type}</h2>

      <div className="mt-3 flex flex-col items-center justify-between gap-y-2 gap-x-1 border-b border-zinc-600 pb-2">
        <Button
          className="p-button-outlined p-button-secondary w-full truncate"
          icon="pi pi-folder"
          iconPos="right"
          label="New Folder"
          onClick={() => {
            createItemMutation?.mutate({
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
              type,
            });
          }}>
          <div className="flex w-full items-center justify-center gap-x-1">
            <div className="w-full">New {itemName === "board" ? "graph" : itemName}</div>
            <div className="ml-auto">
              <Icon fontSize={20} icon={getItemIconForTree(type)} />
            </div>
          </div>
        </Button>
      </div>

      <BaseTree type={type} />
    </div>
  );
}
