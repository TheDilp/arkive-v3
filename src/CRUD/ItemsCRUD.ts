import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { baseURLS, createURLS, deleteURLs, getURLS, updateURLs } from "../types/CRUDenums";
import { DocumentCreateType, DocumentType } from "../types/documentTypes";
import { AvailableItemTypes } from "../types/generalTypes";
import { MapCreateType, MapType } from "../types/mapTypes";
import { SortIndexes } from "../types/treeTypes";
import { getURL, updateURL } from "../utils/CRUDUrls";
import { toaster } from "../utils/toast";
export const useGetAllItems = (project_id: string, type: AvailableItemTypes) => {
  return useQuery<DocumentType[] | MapType[]>(
    ["allItems", project_id, type],
    async () => {
      const url = getURL(project_id as string, type);
      if (url)
        return await (
          await fetch(url, {
            method: "GET",
          })
        ).json();
    },
    {
      staleTime: 5 * 60 * 1000,
    },
  );
};

export const useGetAllImages = (project_id: string) => {
  return useQuery<string[]>(
    ["allImages", project_id],
    async () =>
      await (
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
      await (
        await fetch(`${baseURLS.baseServer}${getURLS.getAllMapImages}${project_id}`, {
          method: "GET",
        })
      ).json(),
    {
      staleTime: 5 * 60 * 1000,
    },
  );
};

export const useCreateMutation = (
  type: AvailableItemTypes,
): UseMutationResult<Response, unknown, DocumentCreateType | MapCreateType, unknown> | null => {
  const queryClient = useQueryClient();
  if (type === "documents") {
    const createDocumentMutation = useMutation(
      async (newDocument: DocumentCreateType) =>
        await fetch(`${baseURLS.baseServer}${createURLS.createDocument}`, {
          body: JSON.stringify(newDocument),
          method: "POST",
        }),
      {
        onError: () => {
          toaster("error", "There was an error creating this document.");
        },
        onSuccess: async (data, variables) => {
          const newData: DocumentType = await data.json();
          queryClient.setQueryData(
            ["allItems", variables.project_id, "documents"],
            (old: DocumentType[] | undefined) => {
              if (old) return [...old, newData];
              else return [newData];
            },
          );
          toaster("success", "Your document was successfully created.");
        },
      },
    );

    return createDocumentMutation;
  }
  if (type === "maps") {
    const createMapMutation = useMutation(
      async (newMap: MapCreateType) =>
        await fetch(`${baseURLS.baseServer}${createURLS.createMap}`, {
          body: JSON.stringify(newMap),
          method: "POST",
        }),
      {
        onError: () => {
          toaster("error", "There was an error creating this map.");
        },
        onSuccess: async (data, variables) => {
          const newData: MapType = await data.json();
          queryClient.setQueryData(["allItems", variables.project_id, "maps"], (old: MapType[] | undefined) => {
            if (old) return [...old, newData];
            else return [newData];
          });
          toaster("success", "Your map was successfully created.");
        },
      },
    );

    return createMapMutation;
  }
  return null;
};

export const useUpdateMutation = (type: AvailableItemTypes) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (updateItemValues: Partial<DocumentType>) => {
      if (updateItemValues.id) {
        const url = updateURL(updateItemValues.id, type);
        if (url)
          return await fetch(url, {
            body: JSON.stringify(updateItemValues),
            method: "POST",
          });
      }
    },
    {
      onError: () => toaster("error", "There was an error updating this item."),
      onSuccess: async (data, variables) => {
        const newData: DocumentType = await data?.json();
        if (newData)
          queryClient.setQueryData(
            ["allItems", newData.project_id, type],
            (old: DocumentType[] | MapType[] | undefined) => {
              if (old)
                return old.map((item) => {
                  if (item.id === variables.id) return { ...item, ...variables };
                  return item;
                });
            },
          );
      },
    },
  );
};

export const useDeleteMutation = (type: AvailableItemTypes) => {
  const queryClient = useQueryClient();

  const deleteDocumentMutation = useMutation(
    async (id: string) =>
      await fetch(`${baseURLS.baseServer}${deleteURLs.deleteDocument}${id}`, {
        method: "DELETE",
      }),
    {
      onSuccess: async (data, id) => {
        const newData: DocumentType = await data.json();
        queryClient.setQueryData(["allDocuments", newData.project_id], (old: DocumentType[] | undefined) => {
          if (old) return old.filter((doc) => doc.id !== id);
        });
      },
    },
  );
  if (type === "documents") return deleteDocumentMutation;
};

export const useSortMutation = (
  type: AvailableItemTypes,
): UseMutationResult<Response, unknown, SortIndexes, unknown> | undefined => {
  const sortDocumentMutation = useMutation(
    async (updateDocumentValues: SortIndexes) => {
      return await fetch(`${baseURLS.baseServer}${updateURLs.sortDocuments}`, {
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
      return await fetch(`${baseURLS.baseServer}${updateURLs.sortMaps}`, {
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
