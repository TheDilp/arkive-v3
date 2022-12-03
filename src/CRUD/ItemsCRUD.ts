import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";

import { baseURLS, deleteURLs, getURLS, updateURLs } from "../types/CRUDenums";
import { DocumentType } from "../types/documentTypes";
import {
  AllAvailableTypes,
  AllItemsType,
  AllSubItemsType,
  AvailableItemTypes,
  AvailableSubItemTypes,
} from "../types/generalTypes";
import { MapType } from "../types/mapTypes";
import { SortIndexes } from "../types/treeTypes";
import { getItems } from "../utils/CRUD/CRUDFunctions";
import { createURL, updateURL } from "../utils/CRUD/CRUDUrls";
import { toaster } from "../utils/toast";

export const useGetAllItems = (project_id: string, type: AvailableItemTypes) => {
  return useQuery<(DocumentType | MapType)[]>(
    ["allItems", project_id, type],
    async () => getItems(project_id as string, type),
    {
      staleTime: 5 * 60 * 1000,
    },
  );
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

export const useCreateSubItem = (project_id: string, subType: AvailableSubItemTypes) => {
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
      onError: () => toaster("error", "There was an error creating this item."),
      onSuccess: async (data) => {
        const type = "maps";
        const newData: AllSubItemsType = await data?.json();
        // queryClient.invalidateQueries(["allItems", project_id, type]);
        if (newData)
          queryClient.setQueryData(["allItems", project_id, type], (old: AllItemsType[] | undefined) => {
            return old
              ? [
                  ...old.map((item: AllItemsType) => {
                    if (item.id === newData.parent) {
                      if ("map_pins" in item) return { ...item, map_pins: [...item.map_pins, newData] };
                    }
                    return item;
                  }),
                ]
              : old;
          });
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
export const useUpdateSubItem = (type: AvailableSubItemTypes) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (updateItemValues: Partial<AllSubItemsType>) => {
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

export const useDeleteMutation = (type: AvailableItemTypes) => {
  const queryClient = useQueryClient();

  const deleteDocumentMutation = useMutation(
    async (id: string) =>
      fetch(`${baseURLS.baseServer}${deleteURLs.deleteDocument}${id}`, {
        method: "DELETE",
      }),

    {
      onSuccess: async (data, id) => {
        const newData: DocumentType = await data.json();
        queryClient.setQueryData(["allDocuments", newData.project_id], (old: DocumentType[] | undefined) => {
          if (old) return old.filter((doc) => doc.id !== id);
          return [];
        });
        return [];
      },
    },
  );
  if (type === "documents") return deleteDocumentMutation;
  return null;
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
