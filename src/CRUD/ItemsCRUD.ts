import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";

import { BoardType } from "../types/boardTypes";
import { baseURLS, getURLS } from "../types/CRUDenums";
import { AllAvailableTypes, AllItemsType, AvailableItemTypes, AvailableSubItemTypes } from "../types/generalTypes";
import { SortIndexes } from "../types/treeTypes";
import { FetchFunction } from "../utils/CRUD/CRUDFetch";
import { getItems } from "../utils/CRUD/CRUDFunctions";
import { createURL, deleteManyURL, deleteURL, sortURL, updateManyURL, updateURL } from "../utils/CRUD/CRUDUrls";
import { toaster } from "../utils/toast";

export const useGetAllItems = <ItemType>(project_id: string, type: AvailableItemTypes, options?: UseQueryOptions) => {
  return useQuery<ItemType[]>(["allItems", project_id, type], async () => getItems(project_id as string, type), {
    enabled: options?.enabled,
    staleTime: options?.staleTime,
  });
};

export const useCreateItem = <ItemType>(type: AvailableItemTypes) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (newItemValues: Partial<ItemType>) => {
      const url = createURL(type);
      if (url) return FetchFunction({ url, body: JSON.stringify(newItemValues), method: "POST" });

      return null;
    },
    {
      onError: () => toaster("error", "There was an error creating this item."),
      onSuccess: async (data) => {
        const newData: AllItemsType = await data?.json();
        if (newData) {
          queryClient.setQueryData(["allItems", newData.project_id, type], (old: AllItemsType[] | undefined) => {
            if (old) return [...old, newData];
            return [newData];
          });
          toaster("success", "Item successfully created.");
        }
      },
    },
  );
};

export const useCreateSubItem = <SubItemType extends { id: string; parentId: string }>(
  id: string,
  subType: AvailableSubItemTypes,
  type: AvailableItemTypes,
) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (newSubItemValues: Partial<SubItemType>) => {
      const url = createURL(subType);
      if (url) return FetchFunction({ url, body: JSON.stringify(newSubItemValues), method: "POST" });

      return null;
    },
    {
      onMutate: async (variables) => {
        if (!variables.parentId || !variables.id) throw new Error("NO ID OR PARENT.");
        const oldData: AllItemsType | undefined = queryClient.getQueryData([type, id]);
        if (oldData && variables) {
          if (
            type === "boards" &&
            ((subType === "nodes" && "nodes" in oldData) || (subType === "edges" && "edges" in oldData))
          ) {
            const updatedData = [...(oldData[subType] || []), variables];

            queryClient.setQueryData([type, id], { ...oldData, [subType]: updatedData });
          }
          if (
            type === "maps" &&
            ((subType === "map_layers" && "map_layers" in oldData) || (subType === "map_pins" && "map_pins" in oldData))
          ) {
            const updatedData = [...(oldData[subType] || []), variables];
            queryClient.setQueryData([type, id], { ...oldData, [subType]: updatedData });
          }
        }

        return { oldData };
      },
      onError: (error, variables, context) => {
        toaster("error", `There was an error updating this item. ${error}`);
        queryClient.setQueryData([type, id], context?.oldData);
      },
    },
  );
};

export const useUpdateItem = <ItemType extends { id: string }>(type: AllAvailableTypes, project_id: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (updateItemValues: Partial<ItemType>) => {
      if (updateItemValues.id) {
        const url = updateURL(updateItemValues.id, type);
        if (url) return FetchFunction({ url, body: JSON.stringify(updateItemValues), method: "POST" });
      }
      return null;
    },
    {
      onSuccess: (_, variables) => {
        if ("content" in variables && !variables?.content) toaster("success", "Item successfully updated.");
      },
      onMutate: async (variables) => {
        const oldData = queryClient.getQueryData([type, variables.id]);
        // Don't update in case of documents when saving content, messes with editor saving and updating
        if (type === "documents" && "content" in variables) return { oldData };
        if (variables) {
          // @ts-ignore
          queryClient.setQueryData([type, variables.id], (old: AllItemsType | undefined) => {
            if (old) return { ...old, ...variables };
            return old;
          });

          if ("isPublic" in variables || "expanded" in variables) {
            queryClient.setQueryData(["allItems", project_id, type], (oldAllItems: AllItemsType[] | undefined) => {
              if (oldAllItems) {
                return oldAllItems.map((item) => {
                  if (item.id === variables.id)
                    return {
                      ...item,
                      isPublic: "isPublic" in variables ? (variables.isPublic as boolean) : item.isPublic,
                      expanded: "expanded" in variables ? (variables.expanded as boolean) : item.expanded,
                    };
                  return item;
                });
              }
              return oldAllItems;
            });
            if ("isPublic" in variables) toaster("info", `Item changed to ${variables.isPublic ? "PUBLIC" : "PRIVATE"}.`);
          }
        }

        return { oldData };
      },
      onError: (_, variables, context) => {
        toaster("error", "There was an error updating this item.");
        queryClient.setQueryData([type, variables.id], context?.oldData);
      },
    },
  );
};
export const useUpdateSubItem = <SubItemType extends { id: string }>(
  item_id: string,
  subType: AvailableSubItemTypes,
  type: AvailableItemTypes,
) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (updateItemValues: Partial<SubItemType>) => {
      if (updateItemValues.id) {
        const url = updateURL(updateItemValues.id, subType);
        if (url) return FetchFunction({ url, body: JSON.stringify(updateItemValues), method: "POST" });
      }
      return null;
    },
    {
      onMutate: async (variables) => {
        const oldData: AllItemsType | undefined = queryClient.getQueryData([type, item_id]);

        if (oldData && variables) {
          if (
            type === "boards" &&
            ((subType === "nodes" && "nodes" in oldData) || (subType === "edges" && "edges" in oldData))
          ) {
            const updatedData = (oldData[subType] || []).map((subItem) => {
              if (subItem.id === variables.id) return { ...subItem, ...variables };
              return subItem;
            });
            queryClient.setQueryData([type, item_id], { ...oldData, [subType]: updatedData });
          }
          if (
            type === "maps" &&
            ((subType === "map_layers" && "map_layers" in oldData) || (subType === "map_pins" && "map_pins" in oldData))
          ) {
            const updatedData = (oldData[subType] || []).map((subItem) => {
              if (subItem.id === variables.id) return { ...subItem, ...variables };
              return subItem;
            });
            queryClient.setQueryData([type, item_id], { ...oldData, [subType]: updatedData });
          }
        }

        return { oldData };
      },
      onError: (_, __, context) => {
        toaster("error", "There was an error updating this item.");
        queryClient.setQueryData([type, item_id], context?.oldData);
      },
    },
  );
};

export const useDeleteItem = (type: AllAvailableTypes, project_id: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => {
      if (id) {
        const url = deleteURL(id, type);
        if (url) return FetchFunction({ url, method: "DELETE" });
      }
      return null;
    },

    {
      onSuccess: async () => {
        if (["documents", "maps", "boards"].includes(type)) queryClient.refetchQueries(["allItems", project_id, type]);
        // if (["map_pins", "map_layers"].includes(type)) queryClient.refetchQueries(["allItems", project_id, "maps"]);
        // if (["boards", "nodes", "edges"].includes(type)) queryClient.refetchQueries(["allItems", project_id, "boards"]);
        toaster("success", "Item successfully deleted.");
      },
    },
  );
};
export const useDeleteManyItems = (type: AvailableItemTypes, project_id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (ids: string[]) => {
      if (ids) {
        const url = deleteManyURL(type);
        if (url) return FetchFunction({ url, body: JSON.stringify(ids), method: "DELETE" });
      }
      return null;
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["allItems", project_id, type] });
        toaster("success", "Items successfully deleted.");
      },
      onError: () => toaster("error", "There was an error deleting these items."),
    },
  );
};

export const useSortMutation = (project_id: string, type: AvailableItemTypes) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (updateValues: SortIndexes) => {
      const url = sortURL(type);
      if (url) {
        return FetchFunction({ url, body: JSON.stringify(updateValues), method: "POST" });
      }

      return null;
    },
    {
      onMutate: (variables) => {
        const oldData = queryClient.getQueryData(["allItems", project_id, type]);

        queryClient.setQueryData(["allItems", project_id, type], (prev: AllItemsType[] | undefined) => {
          if (prev)
            return prev.map((item) => {
              const idx = variables.findIndex((sortIndex) => sortIndex.id === item.id);
              if (idx !== -1) return { ...item, parentId: variables[idx].parentId, sort: variables[idx].sort };
              return item;
            });

          return prev;
        });

        return { oldData };
      },
      onError: () => toaster("error", "There was an error updating your documents."),
    },
  );
};

export const useUpdateManySubItems = <SubItemType>(item_id: string, subType: AvailableSubItemTypes) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (updateItemValues: { ids: string[]; data: Partial<SubItemType> }) => {
      if (updateItemValues.ids) {
        const url = updateManyURL(subType);
        if (url) return FetchFunction({ url, body: JSON.stringify(updateItemValues), method: "POST" });
      }
      return null;
    },
    {
      onMutate: async (variables) => {
        const old = queryClient.getQueryData(["boards", item_id]);
        if (subType === "nodes" || subType === "edges") {
          queryClient.setQueryData(["boards", item_id], (oldData: BoardType | undefined) => {
            if (oldData) {
              if (subType === "nodes")
                return {
                  ...oldData,
                  [subType]: oldData[subType].map((subItem) => {
                    if (variables.ids.includes(subItem.id)) return { ...subItem, ...variables.data };
                    return subItem;
                  }),
                };
              if (subType === "edges")
                return {
                  ...oldData,
                  [subType]: oldData[subType].map((subItem) => {
                    if (variables.ids.includes(subItem.id)) return { ...subItem, ...variables.data };
                    return subItem;
                  }),
                };
            }
            return oldData;
          });
        }
        return { old };
      },
      onError: (error, variables, context) => {
        toaster("error", "There was an error updating these items.");
        queryClient.setQueryData(["boards", item_id], context?.old);
      },
    },
  );
};
export const useDeleteManySubItems = (item_id: string, subType: AvailableSubItemTypes) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (ids: string[]) => {
      if (ids) {
        const url = deleteManyURL(subType);
        if (url) return FetchFunction({ url, body: JSON.stringify(ids), method: "DELETE" });
      }
      return null;
    },
    {
      onMutate: async (ids) => {
        const old = queryClient.getQueryData(["boards", item_id]);
        if (subType === "nodes" || subType === "edges") {
          queryClient.setQueryData(["boards", item_id], (oldData: BoardType | undefined) => {
            if (oldData) {
              if (subType === "nodes") {
                return { ...oldData, [subType]: oldData[subType].filter((subItem) => !ids.includes(subItem.id)) };
              }
              if (subType === "edges") {
                return { ...oldData, [subType]: oldData[subType].filter((subItem) => !ids.includes(subItem.id)) };
              }
            }
            return oldData;
          });
        }
        return { old };
      },
      onSuccess: () => toaster("success", "Items successfully deleted."),
      onError: (error, variables, context) => {
        toaster("error", "There was an error deleting these items.");
        queryClient.setQueryData(["boards", item_id], context?.old);
      },
    },
  );
};

export const useUpdateManyNodesPosition = (item_id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (updateItemValues: { id: string; x: number; y: number }[]) => {
      if (updateItemValues.length) {
        return FetchFunction({
          url: `${baseURLS.baseServer}updatemanynodesposition`,
          body: JSON.stringify(updateItemValues),
          method: "POST",
        });
      }
      return null;
    },
    {
      onMutate: async (variables) => {
        const old = queryClient.getQueryData(["boards", item_id]);
        queryClient.setQueryData(["boards", item_id], (oldData: BoardType | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              nodes: oldData.nodes.map((subItem) => {
                const idx = variables.findIndex((varNode) => varNode.id === subItem.id);
                if (idx > -1) {
                  return { ...subItem, ...variables[idx] };
                }
                return subItem;
              }),
            };
          }
          return oldData;
        });
        return { old };
      },
      onError: (error, variables, context) => {
        toaster("error", "There was an error updating these items.");
        queryClient.setQueryData(["boards", item_id], context?.old);
      },
    },
  );
};

export const useGetAllImages = (project_id: string, options?: UseQueryOptions) => {
  return useQuery<{ Key: string }[], unknown, string[]>(
    ["allImages", project_id],
    async () => {
      return (await FetchFunction({ url: `${baseURLS.baseServer}${getURLS.getAllImages}${project_id}`, method: "GET" })).json();
    },
    {
      enabled: options?.enabled,
      staleTime: 5 * 60 * 1000,
      select: (data) => {
        return data?.map((image) => `${import.meta.env.VITE_S3_CDN_HOST}/${image.Key}`);
      },
    },
  );
};
export const useGetAllMapImages = (project_id: string) => {
  return useQuery<{ Key: string }[], unknown, string[]>(
    ["allMapImages", project_id],
    async () =>
      (await FetchFunction({ url: `${baseURLS.baseServer}${getURLS.getAllMapImages}${project_id}`, method: "GET" })).json(),
    {
      staleTime: 5 * 60 * 1000,
      select: (data) => {
        return data?.map((image) => `${import.meta.env.VITE_S3_CDN_HOST}/${image.Key}`);
      },
    },
  );
};
export const useGetAllSettingsImages = (project_id: string) => {
  return useQuery<{ image: string; type: "image" | "map" }[]>(
    ["allMapImages", project_id],
    async () =>
      (
        await FetchFunction({ url: `${baseURLS.baseServer}${getURLS.getAllSettingsImages}${project_id}`, method: "GET" })
      ).json(),
    {
      staleTime: 5 * 60 * 1000,
    },
  );
};
