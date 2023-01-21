import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { baseURLS, createURLS, getURLS, updateURLs } from "../types/CRUDenums";
import { ProjectType } from "../types/projectTypes";
import { FetchFunction } from "../utils/CRUD/CRUDFetch";
import { toaster } from "../utils/toast";

export const useGetAllProjects = (enabled: boolean) => {
  return useQuery<ProjectType[]>(
    ["allProjects"],
    async () => {
      try {
        return await (await FetchFunction({ url: `${baseURLS.baseServer}${getURLS.getAllProjects}`, method: "GET" })).json();
      } catch (error) {
        return [];
      }
    },
    {
      enabled,
    },
  );
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation(async () => FetchFunction({ url: `${baseURLS.baseServer}${createURLS.createProject}`, method: "POST" }), {
    onMutate: async () => {
      const oldData = queryClient.getQueryData(["allProjects"]);

      queryClient.setQueryData(["allProjects"], (old: ProjectType[] | undefined) => {
        if (old) return [...old, { id: crypto.randomUUID(), title: "New Project" }];
        return [{ id: crypto.randomUUID(), title: "New Project" }];
      });

      return { oldData };
    },
    onError: (_, __, context) => {
      toaster("error", "There was an error creating this project");
      if (context?.oldData) queryClient.setQueryData(["allProjects"], context.oldData);
    },
    onSuccess: async () => {
      toaster("success", "Your project has been successfully updated.");
    },
  });
};
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (variables: Partial<ProjectType>) =>
      FetchFunction({
        url: `${baseURLS.baseServer}${updateURLs.updateProject}${variables.id}`,
        method: "POST",
        body: JSON.stringify(variables),
      }),
    {
      onMutate: (variables) => {
        const oldData = queryClient.getQueryData(["singleProject", variables?.id]);
        queryClient.setQueryData<ProjectType>(["singleProject", variables?.id], (old) => {
          if (old) return { ...old, ...variables };
          return old;
        });
        return { oldData };
      },
      onSuccess: async () => {
        toaster("success", "This project has been successfully updated.");
      },
      onError: (_, variables, context) => {
        toaster("error", "There was an error updating this project");
        if (context?.oldData) queryClient.setQueryData(["singleProject", variables?.id], context.oldData);
      },
    },
  );
};
export const useGetSingleProject = (id: string, enabled?: boolean) => {
  return useQuery<ProjectType>(
    ["singleProject", id],
    async () => (await FetchFunction({ url: `${baseURLS.baseServer}${getURLS.getSingeProject}/${id}`, method: "GET" })).json(),
    {
      enabled,
      staleTime: 60 * 5 * 1000,
    },
  );
};
