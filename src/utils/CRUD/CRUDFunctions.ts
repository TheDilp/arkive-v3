import { QueryClient, UseMutateFunction } from "@tanstack/react-query";

import { baseURLS, getURLS } from "../../types/CRUDenums";
import { AvailableItemTypes, TagType } from "../../types/generalTypes";
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

export function createUpdateItem<ItemType extends { id: string; folder: boolean; parentId: string | null; tags: TagType[] }>(
  item: ItemType | undefined,
  newData: Partial<ItemType>,
  changedData: Partial<ItemType>,
  type: AvailableItemTypes,
  project_id: string,
  queryClient: QueryClient,
  defaultItem: Partial<ItemType>,
  allItems: ItemType[] | undefined,
  resetChanges: () => void,
  createMutation: UseMutateFunction<Response | null, unknown, Partial<ItemType>, unknown>,
  updateMutation: UseMutateFunction<
    Response | null,
    unknown,
    Partial<ItemType>,
    {
      oldData: unknown;
    }
  >,
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
    const { tags, ...rest } = changedData;
    updateMutation(
      {
        id: item.id,
        ...rest,
      } as ItemType,
      {
        onSuccess: () => {
          queryClient.refetchQueries({ queryKey: ["allItems", project_id, type] });
          toaster("success", "Item successfully updated.");
        },
      },
    );
  } else {
    createMutation(
      {
        ...defaultItem,
        ...newData,
      },
      {
        onSuccess: () => {
          queryClient.refetchQueries({ queryKey: ["allItems", project_id, type] });
        },
      },
    );
  }
  resetChanges();
}
