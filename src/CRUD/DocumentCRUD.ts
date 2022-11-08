import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentCreateType, DocumentType } from "../types/documentTypes";
import { baseURLS, createURLS, updateURLs } from "../types/enums";
import { ProjectType } from "../types/projectTypes";

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (newDocument: DocumentCreateType) =>
      await fetch(`${baseURLS.baseServer}${createURLS.createDocument}`, {
        method: "POST",
        body: JSON.stringify(newDocument),
      }),
    {
      onSuccess: async (data, variables) => {
        let newData: DocumentType = await data.json();
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
          }
        );
      },
    }
  );
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (updateDocumentValues: Partial<DocumentType>) =>
      await fetch(
        `${baseURLS.baseServer}${updateURLs.updateDocument}${updateDocumentValues.id}`,
        {
          method: "POST",
          body: JSON.stringify(updateDocumentValues),
        }
      ),
    {
      onSuccess: async (data, variables) => {
        let newData: DocumentType = await data.json();
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
          }
        );
      },
    }
  );
};
