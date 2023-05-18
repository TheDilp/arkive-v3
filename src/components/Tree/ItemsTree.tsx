import { Icon } from "@iconify/react";
import { useAtomValue, useSetAtom } from "jotai";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";
import { capitalCase } from "remirror";

import { useCreateItem } from "../../CRUD/ItemsCRUD";
import { AllItemsType, AvailableItemTypes, PermissionCategoriesType } from "../../types/generalTypes";
import { DrawerAtom, PermissionAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { getItemIcon, getItemNameForTitle, getItemNameForTree } from "../../utils/transform";
import BaseTree from "./BaseTree";

type Props = {
  type: AvailableItemTypes;
};

export default function ItemsTree({ type }: Props) {
  const { project_id } = useParams();
  const setDrawer = useSetAtom(DrawerAtom);
  const createItemMutation = useCreateItem<AllItemsType>(type);
  const permissions = useAtomValue(PermissionAtom);
  const itemName = getItemNameForTree(type);
  const pageTitle = getItemNameForTitle(type);
  return (
    <div className="flex h-screen flex-1 flex-col">
      <h2 className="h-8 text-center font-Merriweather text-2xl capitalize">
        {itemName === "dictionary" ? "dictionaries" : `${pageTitle}s`}
      </h2>

      <div className="mt-3 flex flex-col items-center justify-between gap-y-2 gap-x-1 border-zinc-600 pb-2">
        <Button
          className="p-button-outlined p-button-secondary w-full truncate"
          disabled={
            permissions !== "owner" &&
            typeof permissions === "object" &&
            permissions?.[type as PermissionCategoriesType] !== "Edit"
          }
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
          disabled={
            permissions !== "owner" &&
            typeof permissions === "object" &&
            permissions?.[type as PermissionCategoriesType] !== "Edit"
          }
          onClick={() => {
            setDrawer({
              ...DefaultDrawer,
              position: "right",
              show: true,
              type,
            });
          }}>
          <div className="flex w-full items-center justify-center gap-x-1">
            <div className="w-full">New {itemName === "board" ? "Graph" : capitalCase(itemName)}</div>
            <div className="ml-auto">
              <Icon fontSize={20} icon={getItemIcon(type)} />
            </div>
          </div>
        </Button>
      </div>

      <BaseTree type={type} />
    </div>
  );
}
