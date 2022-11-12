import {
  baseURLS,
  createURLS,
  deleteURLs,
  getURLS,
  updateURLs,
} from "../types/CRUDenums";
import { DocumentCreateType, DocumentType } from "../types/documentTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AvailableItemTypes } from "../types/generalTypes";
import { ProjectType } from "../types/projectTypes";
import { toaster } from "../utils/toast";

export const useGetAllDocuments = (project_id: string) => {
  return useQuery<DocumentType[]>(
    ["allDocuments", project_id],
    async () =>
      await (
        await fetch(
          `${baseURLS.baseServer}${getURLS.getAllDocuments}${project_id}`,
          {
            method: "GET",
          },
        )
      ).json(),
    {
      staleTime: 5 * 60 * 1000,
    },
  );
};

export const useCreateMutation = (type: AvailableItemTypes) => {
  const queryClient = useQueryClient();
  const createDocumentMutation = useMutation(
    async (newDocument: DocumentCreateType) =>
      await fetch(`${baseURLS.baseServer}${createURLS.createDocument}`, {
        body: JSON.stringify(newDocument),
        method: "POST",
      }),
    {
      onError: (a, b) => {
        console.log(b);
        toaster("error", "There was an error creating this document.");
      },
      onSuccess: async (data, variables) => {
        const newData: DocumentType = await data.json();
        queryClient.setQueryData(
          ["allDocuments", variables.project_id],
          (old: DocumentType[] | undefined) => {
            if (old) return [...old, newData];
            else return [newData];
          },
        );
        toaster("success", "Your document was successfully created.");
      },
    },
  );

  if (type === "documents") return createDocumentMutation;
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: string) =>
      await fetch(`${baseURLS.baseServer}${deleteURLs.deleteDocument}${id}`, {
        method: "DELETE",
      }),
    {
      onSuccess: async (data, id) => {
        const newData: DocumentType = await data.json();
        queryClient.setQueryData(
          ["singleProject", newData.project_id],
          (old: ProjectType | undefined) => {
            if (old)
              return {
                ...old,
                documents: old.documents?.filter((doc) => doc.id !== id),
              };
          },
        );
      },
    },
  );
};

export const useUpdateMutation = (type: AvailableItemTypes) => {
  const queryClient = useQueryClient();
  const updateDocumentMutation = useMutation(
    async (updateDocumentValues: Partial<DocumentType>) =>
      await fetch(
        `${baseURLS.baseServer}${updateURLs.updateDocument}${updateDocumentValues.id}`,
        {
          body: JSON.stringify(updateDocumentValues),
          method: "POST",
        },
      ),
    {
      onError: () =>
        toaster("error", "There was an error updating your document."),
      onSuccess: async (data, variables) => {
        const newData: DocumentType = await data.json();
        queryClient.setQueryData(
          ["allDocuments", newData.project_id],
          (old: DocumentType[] | undefined) => {
            if (old)
              return old.map((doc) => {
                if (doc.id === variables.id) return { ...doc, ...variables };
                return doc;
              });
          },
        );
        toaster("success", "Your document was successfully updated.");
      },
    },
  );

  if (type === "documents") return updateDocumentMutation;
};
