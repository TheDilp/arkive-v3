import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import cloneDeep from "lodash.clonedeep";
import set from "lodash.set";

import { baseURLS, deleteURLs, getURLS } from "../types/CRUDenums";
import { AllAvailableTypes, AllItemsType, AvailableItemTypes, AvailableSubItemTypes } from "../types/generalTypes";
import { BoardType } from "../types/ItemTypes/boardTypes";
import { DictionaryType } from "../types/ItemTypes/dictionaryTypes";
import { RandomTableType } from "../types/ItemTypes/randomTableTypes";
import { ScreenType } from "../types/ItemTypes/screenTypes";
import { SortIndexes } from "../types/treeTypes";
import { FetchFunction } from "../utils/CRUD/CRUDFetch";
import { getItems } from "../utils/CRUD/CRUDFunctions";
import { createURL, deleteManyURL, deleteURL, sortURL, updateManyURL, updateURL } from "../utils/CRUD/CRUDUrls";
import { removeDeletedImages } from "../utils/imageUtils";
import { toaster } from "../utils/toast";

export const useGetAllItems = <ItemType>(project_id: string, type: AvailableItemTypes, options?: UseQueryOptions<ItemType>) => {
  return useQuery<ItemType[]>(["allItems", project_id, type], async () => getItems(project_id as string, type), {
    enabled: options?.enabled,
    staleTime: options?.staleTime,
  });
};
export const useGetManyItems = <ItemType>(
  project_id: string,
  type: AvailableItemTypes,
  ids: string[],
  options?: UseQueryOptions,
) => {
  return useQuery<ItemType[]>({
    queryKey: ["manyItems", project_id, type],
    queryFn: async () => {
      const url = `${baseURLS.baseServer}${getURLS.getManyDocuments}`;
      if (url) {
        return FetchFunction({ url, method: "POST", body: JSON.stringify(ids) });
      }

      return null;
    },
    enabled: options?.enabled,
    staleTime: options?.staleTime,
  });
};

export const useCreateItem = <ItemType>(type: AvailableItemTypes, isTemplate?: boolean) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (newItemValues: Partial<ItemType>) => {
      return FetchFunction({
        url: isTemplate ? `${baseURLS.baseServer}createfromtemplate` : createURL(type),
        body: JSON.stringify(newItemValues),
        method: "POST",
      });
    },
    {
      onError: () => toaster("error", "There was an error creating this item."),
      onSuccess: async (data) => {
        const newData: AllItemsType = data;
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
          } else if (
            type === "maps" &&
            ((subType === "map_layers" && "map_layers" in oldData) || (subType === "map_pins" && "map_pins" in oldData))
          ) {
            const updatedData = [...(oldData[subType] || []), variables];
            queryClient.setQueryData([type, id], { ...oldData, [subType]: updatedData });
          } else if (type === "screens" && subType === "sections" && "sections" in oldData) {
            const updatedData = [...(oldData[subType] || []), variables];
            queryClient.setQueryData([type, id], { ...oldData, [subType]: updatedData });
          } else if (type === "dictionaries" && subType === "words" && "words" in oldData) {
            const updatedData = [...(oldData[subType] || []), variables];
            queryClient.setQueryData([type, id], { ...oldData, [subType]: updatedData });
          }
        }
        return { oldData };
      },

      onError: (error, _, context) => {
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
        const url = updateURL(type);
        if (url) return FetchFunction({ url, body: JSON.stringify(updateItemValues), method: "POST" });
      }
      return null;
    },
    {
      onSuccess: (_, variables) => {
        if ("content" in variables && !variables?.content) toaster("success", "Item successfully updated.");
      },
      onMutate: async (variables) => {
        const oldDataSingle = queryClient.getQueryData<AllItemsType>([type, variables.id]);
        const oldDataAll = queryClient.getQueryData<AllItemsType[]>(["allItems", project_id, type]);
        // Don't update in case of documents when saving content, messes with editor saving and updating
        if (type === "documents" && "content" in variables) return { oldData: oldDataSingle };
        if (variables) {
          // @ts-ignore
          queryClient.setQueryData([type, variables.id], (old: AllItemsType | undefined) => {
            if (old) return { ...old, ...variables };
            return old;
          });
          queryClient.setQueryData(["allItems", project_id, type], (old: AllItemsType[] | undefined) => {
            if (old)
              return old.map((item) => {
                if (item.id === variables.id) return { ...item, ...variables };
                return item;
              });
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
                    };
                  return item;
                });
              }
              return oldAllItems;
            });
            if ("isPublic" in variables) toaster("info", `Item changed to ${variables.isPublic ? "PUBLIC" : "PRIVATE"}.`);
          }
        }

        return { oldDataSingle, oldDataAll } as any;
      },
      onError: (_, variables, context) => {
        toaster("error", "There was an error updating this item.");
        queryClient.setQueryData([type, variables.id], context?.oldDataSingle);
        queryClient.setQueryData(["allItems", project_id, type], context?.oldDataAll);
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
        const url = updateURL(subType);
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
          } else if (
            type === "maps" &&
            ((subType === "map_layers" && "map_layers" in oldData) || (subType === "map_pins" && "map_pins" in oldData))
          ) {
            const updatedData = (oldData[subType] || []).map((subItem) => {
              if (subItem.id === variables.id) return { ...subItem, ...variables };
              return subItem;
            });
            queryClient.setQueryData([type, item_id], { ...oldData, [subType]: updatedData });
          } else if (
            type === "calendars" &&
            ((subType === "months" && "months" in oldData) || (subType === "eras" && "eras" in oldData))
          ) {
            const updatedData = (oldData[subType] || []).map((subItem) => {
              if (subItem.id === variables.id) return { ...subItem, ...variables };
              return subItem;
            });
            queryClient.setQueryData([type, item_id], { ...oldData, [subType]: updatedData });
          } else if (type === "screens" && subType === "sections" && "sections" in oldData) {
            const updatedData = (oldData[subType] || []).map((subItem) => {
              if (subItem.id === variables.id) return { ...subItem, ...variables };
              return subItem;
            });
            queryClient.setQueryData([type, item_id], { ...oldData, [subType]: updatedData });
          } else if (type === "dictionaries" && subType === "words" && "words" in oldData) {
            const updatedData = (oldData[subType] || []).map((subItem) => {
              if (subItem.id === variables.id) return { ...subItem, ...variables };
              return subItem;
            });
            queryClient.setQueryData([type, item_id], { ...oldData, [subType]: updatedData });
          } else if (type === "calendars" && subType === "events") {
            const monthIdx =
              "monthsId" in variables && "months" in oldData
                ? oldData?.months?.findIndex((month) => month.id === variables.monthsId)
                : null;

            if (typeof monthIdx === "number" && monthIdx !== -1 && "months" in oldData) {
              const eventIdx = oldData.months[monthIdx].events.findIndex((event) => event.id === variables.id);

              if (typeof eventIdx === "number" && eventIdx !== -1) {
                const newData = cloneDeep(oldData);
                const newEvents = [...newData.months[monthIdx].events];
                newEvents[eventIdx] = { ...newEvents[eventIdx], ...variables };
                set(newData, `months[${monthIdx}].events`, newEvents);
                queryClient.setQueryData([type, item_id], newData);
              }
            }
          } else if (type === "timelines" && subType === "events") {
            const calendarIdx =
              "calendarsId" in variables && "calendars" in oldData
                ? oldData?.calendars?.findIndex((cal) => cal.id === variables.calendarsId)
                : null;

            if (typeof calendarIdx === "number" && calendarIdx !== -1 && "calendars" in oldData) {
              const eventIdx = oldData.calendars[calendarIdx].events.findIndex((event) => event.id === variables.id);

              if (typeof eventIdx === "number" && eventIdx !== -1) {
                const newData = cloneDeep(oldData);

                const newEvents = [...oldData.calendars[calendarIdx].events];
                newEvents[eventIdx] = { ...newEvents[eventIdx], ...variables };
                set(newData, `calendars[${calendarIdx}].events`, newEvents);
                queryClient.setQueryData([type, item_id], newData);
              }
            }
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
        const url = deleteURL(type);
        if (url) return FetchFunction({ url, method: "DELETE", body: JSON.stringify({ id }) });
      }
      return null;
    },

    {
      onMutate: (id) => {
        const oldData = queryClient.getQueryData<AllItemsType>(["allItems", project_id, type]);
        queryClient.setQueryData<AllItemsType[]>(["allItems", project_id, type], (old) => {
          if (old) {
            return old.filter((item) => item.id !== id);
          }
          return old;
        });
        return { oldData };
      },
      onError: (_, __, context) => {
        toaster("error", "There was an error deleting this item.");
        queryClient.setQueryData(["allItems", project_id, type], context?.oldData);
      },
      onSuccess: () => {
        toaster("success", "Item successfully deleted. 🗑️");
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

export const useSortMutation = (project_id: string, type: AvailableItemTypes | AvailableSubItemTypes) => {
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
      onError: (_, __, context) => {
        toaster("error", "There was an error updating these items.");
        queryClient.setQueryData(["boards", item_id], context?.old);
      },
    },
  );
};

export const useDeleteSubItem = (item_id: string, subType: AvailableSubItemTypes, type: AvailableItemTypes) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: string) => {
      if (id) {
        const url = deleteURL(subType);
        if (url) return FetchFunction({ url, body: JSON.stringify(id), method: "DELETE" });
      }
      return null;
    },
    {
      onMutate: async (id) => {
        const old = queryClient.getQueryData([type, item_id]);
        if (subType === "words" && type === "dictionaries") {
          queryClient.setQueryData([type, item_id], (oldData: DictionaryType | undefined) => {
            if (oldData) {
              return { ...oldData, [subType]: oldData[subType].filter((subItem) => subItem.id !== id) };
            }
            return oldData;
          });
        }
        if (subType === "sections" && type === "screens") {
          queryClient.setQueryData([type, item_id], (oldData: ScreenType | undefined) => {
            if (oldData) {
              return { ...oldData, [subType]: oldData[subType].filter((subItem) => subItem.id !== id) };
            }
            return oldData;
          });
        }
        if (subType === "randomtableoptions" && type === "randomtables") {
          queryClient.setQueryData([type, item_id], (oldData: RandomTableType | undefined) => {
            if (oldData) {
              return { ...oldData, random_table_options: oldData.random_table_options.filter((subItem) => subItem.id !== id) };
            }
            return oldData;
          });
        }

        return { old };
      },
      onSuccess: () => toaster("success", "Items successfully deleted."),
      onError: (_, __, context) => {
        toaster("error", "There was an error deleting these items.");
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
        if (subType === "nodes" || subType === "edges") {
          const old = queryClient.getQueryData(["boards", item_id]);
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
          return { old };
        }
        if (subType === "sections") {
          const old = queryClient.getQueryData(["screens", item_id]);
          queryClient.setQueryData(["screens", item_id], (oldData: ScreenType | undefined) => {
            if (oldData) {
              if (subType === "sections") {
                return { ...oldData, [subType]: oldData[subType].filter((subItem) => !ids.includes(subItem.id)) };
              }
            }
            return oldData;
          });
          return { old };
        }
        return {};
      },
      onSuccess: () => toaster("success", "Items successfully deleted."),
      onError: (_, __, context) => {
        toaster("error", "There was an error deleting these items.");
        if (subType === "nodes" || subType === "edges") queryClient.setQueryData(["boards", item_id], context?.old);
        if (subType === "sections") queryClient.setQueryData(["screens", item_id], context?.old);
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

// Images

export const useGetAllImages = (project_id: string, options?: UseQueryOptions) => {
  return useQuery<{ Key: string }[], unknown, string[]>(
    ["allImages", project_id],
    async () => {
      return FetchFunction({ url: `${baseURLS.baseServer}${getURLS.getAllImages}${project_id}`, method: "GET" });
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
    async () => FetchFunction({ url: `${baseURLS.baseServer}${getURLS.getAllMapImages}${project_id}`, method: "GET" }),
    {
      staleTime: 5 * 60 * 1000,
      select: (data) => {
        return data?.map((image) => `${import.meta.env.VITE_S3_CDN_HOST}/${image.Key}`);
      },
    },
  );
};
export const useGetAllSettingsImages = (project_id: string, options?: UseQueryOptions) => {
  return useQuery<{ Key: string; Size: number }[], unknown, { size: number; images: string[] }>(
    ["allSettingsImages", project_id],
    async () => FetchFunction({ url: `${baseURLS.baseServer}${getURLS.getAllSettingsImages}${project_id}`, method: "GET" }),
    {
      staleTime: options?.staleTime || 5 * 60 * 1000,
      select: (data) => {
        return {
          size: data?.reduce((accumulator, currentValue) => accumulator + currentValue.Size, 0),
          images: data?.map((image) => `${import.meta.env.VITE_S3_CDN_HOST}/${image.Key}`),
        };
      },
      enabled: options?.enabled,
    },
  );
};
export const useDeleteImage = (project_id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (variables: { image: string; type: "images" | "maps" }) => {
      return FetchFunction({
        url: `${baseURLS.baseServer}${deleteURLs.deleteImage}`,
        method: "DELETE",

        body: JSON.stringify({ project_id, image: variables.image, type: variables.type }),
      });
    },
    {
      onMutate: (variables) => {
        queryClient.setQueryData<{ Key: string }[]>(["allSettingsImages", project_id], (oldData) => {
          if (oldData) return removeDeletedImages(oldData, variables);
          return oldData;
        });
        if (variables.type === "images") {
          queryClient.setQueryData<{ Key: string }[]>(["allImages", project_id], (oldData) => {
            if (oldData) return removeDeletedImages(oldData, variables);
            return oldData;
          });
        } else if (variables.type === "maps") {
          queryClient.setQueryData<{ Key: string }[]>(["allMapImages", project_id], (oldData) => {
            if (oldData) return removeDeletedImages(oldData, variables);
            return oldData;
          });
        }

        return {};
      },
    },
  );
};
