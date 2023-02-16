import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { SetStateAction } from "jotai";

import { handleCloseDrawer } from "../../components/Drawer/Drawer";
import { baseURLS, getURLS } from "../../types/CRUDenums";
import { DrawerAtomType } from "../../types/drawerDialogTypes";
import { AllItemsType, AvailableItemTypes, TagType } from "../../types/generalTypes";
import { toaster } from "../toast";
import { FetchFunction } from "./CRUDFetch";
import { getURL } from "./CRUDUrls";

export const getItems = async (project_id: string, type: AvailableItemTypes) => {
  const url = getURL(project_id as string, type);
  if (url) return FetchFunction({ url, method: "GET" });
  return null;
};
export const getTags = async (project_id: string, type: AvailableItemTypes) =>
  FetchFunction({ url: `${baseURLS.baseServer}${getURLS.getAllTags}${type}/${project_id}`, method: "GET" });

export async function createUpdateItem<
  ItemType extends { id: string; folder: boolean; parentId: string | null; tags: TagType[] },
>(
  item: ItemType | undefined,
  newData: Partial<ItemType>,
  changedData: Partial<ItemType>,
  defaultItem: Partial<ItemType>,
  allItems: ItemType[] | undefined,
  resetChanges: () => void,
  createMutation: UseMutateAsyncFunction<Response | null, unknown, Partial<ItemType>, unknown>,
  updateMutation: UseMutateAsyncFunction<
    Response | null,
    unknown,
    Partial<ItemType>,
    {
      oldData: unknown;
      oldDataSingle: AllItemsType;
      oldDataAll: AllItemsType[];
    }
  >,
  setDrawer: (update: SetStateAction<DrawerAtomType>) => void,
) {
  if (item) {
    if (allItems?.some((sItem) => sItem?.parentId === newData.id) && !newData.folder) {
      toaster("warning", "Cannot convert to file if folder contains files.");
      return;
    }
    if (!changedData) {
      toaster("info", "No data was changed.");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await updateMutation(
      {
        id: item.id,
        ...changedData,
      } as ItemType,
      {
        onSuccess: () => {
          toaster("success", "Item successfully updated.");
          handleCloseDrawer(setDrawer, "right");
        },
      },
    );
  } else {
    await createMutation(
      {
        ...defaultItem,
        ...newData,
      },
      {
        onSuccess: () => {
          handleCloseDrawer(setDrawer, "right");
        },
      },
    );
  }
  resetChanges();
}
