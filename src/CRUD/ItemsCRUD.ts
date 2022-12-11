import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";

import { BoardType, NodeType } from "../types/boardTypes";
import { baseURLS, getURLS, updateURLs } from "../types/CRUDenums";
import {
  AllAvailableTypes,
  AllItemsType,
  AllSubItemsType,
  AvailableItemTypes,
  AvailableSubItemTypes,
} from "../types/generalTypes";
import { SortIndexes } from "../types/treeTypes";
import { getItems } from "../utils/CRUD/CRUDFunctions";
import { createURL, deleteURL, updateManyURL, updateURL } from "../utils/CRUD/CRUDUrls";
import { toaster } from "../utils/toast";

export const useGetAllItems = (project_id: string, type: AvailableItemTypes) => {
  return useQuery<AllItemsType[]>(["allItems", project_id, type], async () => getItems(project_id as string, type), {
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetAllImages = (project_id: string) => {
  return useQuery<string[]>(
    ["allImages", project_id],
    async () =>
      (
        await fetch(`${baseURLS.baseServer}${getURLS.getAllImages}${project_id}`, {
          method: "GET",
        })
      ).json(),
    {
      staleTime: 5 * 60 * 1000,
    },
  );
};
export const useGetAllMapImages = (project_id: string) => {
  return useQuery<string[]>(
    ["allMapImages", project_id],
    async () =>
      (
        await fetch(`${baseURLS.baseServer}${getURLS.getAllMapImages}${project_id}`, {
          method: "GET",
        })
      ).json(),
    {
      staleTime: 5 * 60 * 1000,
    },
  );
};

export const useCreateItem = (type: AvailableItemTypes) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (newItemValues: Partial<AllItemsType>) => {
      const url = createURL(type);
      if (url)
        return fetch(url, {
          body: JSON.stringify(newItemValues),
          method: "POST",
        });

      return null;
    },
    {
      onError: () => toaster("error", "There was an error creating this item."),
      onSuccess: async (data) => {
        const newData: AllItemsType = await data?.json();
        if (newData)
          queryClient.setQueryData(["allItems", newData.project_id, type], (old: AllItemsType[] | undefined) => {
            if (old) return [...old, newData];
            return [newData];
          });
      },
    },
  );
};

export const useCreateSubItem = (project_id: string, subType: AvailableSubItemTypes, type: AvailableItemTypes) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (newSubItemValues: Partial<AllSubItemsType>) => {
      const url = createURL(subType);
      if (url)
        return fetch(url, {
          body: JSON.stringify(newSubItemValues),
          method: "POST",
        });

      return null;
    },
    {
      onError: () => toaster("error", "There was an error creating this sub item."),
      onSuccess: async (data) => {
        const newData: AllSubItemsType = await data?.json();
        if (newData) queryClient.refetchQueries(["allItems", project_id, type]);
      },
    },
  );
};

export const useUpdateItem = (type: AllAvailableTypes) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (updateItemValues: Partial<AllItemsType>) => {
      if (updateItemValues.id) {
        const url = updateURL(updateItemValues.id, type);
        if (url)
          return fetch(url, {
            body: JSON.stringify(updateItemValues),
            method: "POST",
          });
      }
      return null;
    },
    {
      onError: () => toaster("error", "There was an error updating this item."),
      onSuccess: async (data, variables) => {
        const newData: AllItemsType = await data?.json();
        if (newData)
          queryClient.setQueryData(["allItems", newData.project_id, type], (old: AllItemsType[] | undefined) => {
            if (old)
              return old.map((item) => {
                if (item.id === variables.id) return { ...item, ...variables };
                return item;
              });

            return [];
          });
      },
    },
  );
};
export const useUpdateSubItem = (project_id: string, subType: AvailableSubItemTypes, type: AvailableItemTypes) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (updateItemValues: Partial<AllSubItemsType>) => {
      if (updateItemValues.id) {
        const url = updateURL(updateItemValues.id, subType);
        if (url)
          return fetch(url, {
            body: JSON.stringify(updateItemValues),
            method: "POST",
          });
      }
      return null;
    },
    {
      onError: () => toaster("error", "There was an error updating this item."),
      onSuccess: async (data) => {
        const newData: AllItemsType = await data?.json();
        if (newData) queryClient.refetchQueries(["allItems", project_id, type]);
      },
    },
  );
};

export const useDeleteMutation = (type: AllAvailableTypes, project_id: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => {
      if (id) {
        const url = deleteURL(id, type);
        if (url)
          return fetch(url, {
            method: "DELETE",
          });
      }
      return null;
    },

    {
      onSuccess: async () => {
        if (["documents", "maps"].includes(type)) queryClient.refetchQueries(["allItems", project_id, type]);
        if (["map_pins", "map_layers"].includes(type)) queryClient.refetchQueries(["allItems", project_id, "maps"]);
      },
    },
  );
};

export const useSortMutation = (
  type: AvailableItemTypes,
): UseMutationResult<Response, unknown, SortIndexes, unknown> | undefined => {
  const sortDocumentMutation = useMutation(
    async (updateDocumentValues: SortIndexes) => {
      return fetch(`${baseURLS.baseServer}${updateURLs.sortDocuments}`, {
        body: JSON.stringify(updateDocumentValues),
        method: "POST",
      });
    },
    {
      onError: () => toaster("error", "There was an error updating your documents."),
    },
  );
  const sortMapsMutation = useMutation(
    async (updateMapValues: SortIndexes) => {
      return fetch(`${baseURLS.baseServer}${updateURLs.sortMaps}`, {
        body: JSON.stringify(updateMapValues),
        method: "POST",
      });
    },
    {
      onError: () => toaster("error", "There was an error updating your documents."),
    },
  );

  if (type === "documents") return sortDocumentMutation;
  if (type === "maps") return sortMapsMutation;

  return undefined;
};

// Board Mutations

export const useCreateNode = (project_id: string, subType: "nodes" | "edges") => {
  const queryClient = useQueryClient();
  return useMutation(
    async (createValues: NodeType) => {
      const url = createURL(subType);
      if (url)
        return fetch(url, {
          body: JSON.stringify(createValues),
          method: "POST",
        });
      return null;
    },
    {
      onMutate: (newData) => {
        const oldQueryData = queryClient.getQueryData(["allItems", project_id, "boards"]);
        queryClient.setQueryData(["allItems", project_id, "boards"], (oldData: BoardType[] | undefined) => {
          if (oldData)
            return oldData.map((board) => {
              if (board.id === newData.parent) return { ...board, nodes: [...board.nodes, newData] };
              return board;
            });

          return [];
        });

        return { oldQueryData };
      },
      onError: (error, variables, context) => {
        if (error) queryClient.setQueryData(["allItems", project_id, "boards"], context?.oldQueryData);
      },
    },
  );
};
export const useUpdateNode = (subType: "nodes" | "edges") => {
  return useMutation(
    async (updateItemValues: Partial<AllSubItemsType>) => {
      if (updateItemValues.id) {
        const url = updateURL(updateItemValues.id, subType);
        if (url)
          return fetch(url, {
            body: JSON.stringify(updateItemValues),
            method: "POST",
          });
      }
      return null;
    },
    {
      onSuccess: (data) => {
        console.log(data);
      },
    },
  );
};
export const useUpdateMany = (type: AllAvailableTypes) => {
  return useMutation(
    async (updateItemValues: { ids: string[]; data: Partial<AllItemsType | AllSubItemsType> }) => {
      if (updateItemValues.ids) {
        const url = updateManyURL(type);
        if (url)
          return fetch(url, {
            body: JSON.stringify(updateItemValues),
            method: "POST",
          });
      }
      return null;
    },
    {
      onSuccess: (data) => {
        console.log(data);
      },
    },
  );
};
