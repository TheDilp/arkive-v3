import {
  baseURLS,
  createURLS,
  deleteURLs,
  updateURLs,
} from "../types/CRUDenums";
import { DocumentCreateType, DocumentType } from "../types/documentTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AvailableItemTypes } from "../types/generalTypes";
import { ProjectType } from "../types/projectTypes";

export const useCreateMutation = (type: AvailableItemTypes) => {
  const queryClient = useQueryClient();
  const createDocumentMutation = useMutation(
    async (newDocument: DocumentCreateType) =>
      await fetch(`${baseURLS.baseServer}${createURLS.createDocument}`, {
        body: JSON.stringify(newDocument),
        method: "POST",
      }),
    {
      onSuccess: async (data, variables) => {
        const newData: DocumentType = await data.json();
        queryClient.setQueryData(
          ["singleProject", variables.project_id],
          (old: ProjectType | undefined) => {
            if (old)
              return {
                ...old,
                documents: old.documents
                  ? [...old.documents, newData]
                  : [newData],
              };
          },
        );
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
      onSuccess: async (data, variables) => {
        const newData: DocumentType = await data.json();
        queryClient.setQueryData(
          ["singleProject", newData.project_id],
          (old: ProjectType | undefined) => {
            if (old)
              return {
                ...old,
                documents: old.documents?.map((doc) => {
                  if (doc.id === variables.id) return { ...doc, ...variables };
                  return doc;
                }),
              };
          },
        );
      },
    },
  );

  if (type === "documents") return updateDocumentMutation;
};
