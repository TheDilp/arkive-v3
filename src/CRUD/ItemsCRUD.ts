import { baseURLS, createURLS, deleteURLs, getURLS, updateURLs } from "../types/CRUDenums";
import { DocumentCreateType, DocumentType } from "../types/documentTypes";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { AvailableItemTypes } from "../types/generalTypes";
import { toaster } from "../utils/toast";
import { SortIndexes } from "../types/treeTypes";
import { MapCreateType, MapType } from "../types/mapTypes";
console.log(`${baseURLS.baseServer}${getURLS.getAllImages}123445`);
export const useGetAllDocuments = (project_id: string) => {
  return useQuery<DocumentType[]>(
    ["allDocuments", project_id],
    async () =>
      await (
        await fetch(`${baseURLS.baseServer}${getURLS.getAllDocuments}${project_id}`, {
          method: "GET",
        })
      ).json(),
    {
      staleTime: 5 * 60 * 1000,
    },
  );
};
export const useGetAllMaps = (project_id: string) => {
  return useQuery<MapType[]>(
    ["allMaps", project_id],
    async () =>
      await (
        await fetch(`${baseURLS.baseServer}${getURLS.getAllMaps}${project_id}`, {
          method: "GET",
        })
      ).json(),
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
          queryClient.setQueryData(["allDocuments", variables.project_id], (old: DocumentType[] | undefined) => {
            if (old) return [...old, newData];
            else return [newData];
          });
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
          queryClient.setQueryData(["allMaps", variables.project_id], (old: MapType[] | undefined) => {
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
  const updateDocumentMutation = useMutation(
    async (updateDocumentValues: Partial<DocumentType>) => {
      return await fetch(`${baseURLS.baseServer}${updateURLs.updateDocument}${updateDocumentValues.id}`, {
        body: JSON.stringify(updateDocumentValues),
        method: "POST",
      });
    },
    {
      onError: () => toaster("error", "There was an error updating your document."),
      onSuccess: async (data, variables) => {
        const newData: DocumentType = await data.json();
        queryClient.setQueryData(["allDocuments", newData.project_id], (old: DocumentType[] | undefined) => {
          if (old)
            return old.map((doc) => {
              if (doc.id === variables.id) return { ...doc, ...variables };
              return doc;
            });
        });
      },
    },
  );

  if (type === "documents") return updateDocumentMutation;
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
