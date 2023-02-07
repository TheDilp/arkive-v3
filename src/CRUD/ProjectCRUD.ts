import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { baseURLS, createURLS, getURLS, updateURLs } from "../types/CRUDenums";
import { ProjectType } from "../types/ItemTypes/projectTypes";
import { FetchFunction } from "../utils/CRUD/CRUDFetch";
import { toaster } from "../utils/toast";

export const useGetAllProjects = (enabled: boolean) => {
  return useQuery<ProjectType[]>(
    ["allProjects"],
    async () => {
      try {
        return FetchFunction({ url: `${baseURLS.baseServer}getallprojects`, method: "GET" });
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
    onError: () => {
      toaster("error", "There was an error creating this project");
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["allProjects"], (old: ProjectType[] | undefined) => {
        if (old) return [...old, { ...data }];
        return [data];
      });
      toaster("success", "Your project has been successfully updated.");
    },
  });
};
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (variables: Partial<ProjectType>) =>
      FetchFunction({
        url: `${baseURLS.baseServer}${updateURLs.updateProject}`,
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
      onSuccess: async (_, variables) => {
        toaster(
          "success",
          !variables.title ? "Project successfully updated." : `Project "${variables.title}" has been updated.`,
        );
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
    async () =>
      FetchFunction({ url: `${baseURLS.baseServer}${getURLS.getSingeProject}`, method: "POST", body: JSON.stringify({ id }) }),
    {
      enabled,
      staleTime: 60 * 5 * 1000,
    },
  );
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => {
      if (id) {
        const url = `${baseURLS.baseServer}deleteproject`;
        if (url) return FetchFunction({ url, method: "DELETE", body: JSON.stringify({ id }) });
      }
      return null;
    },
    {
      onMutate: (variables) => {
        const oldData = queryClient.getQueryData(["allProjects"]);
        queryClient.setQueryData(["allProjects"], (old: ProjectType[] | undefined) => {
          if (old) {
            return old.filter((project) => project.id !== variables);
          }
          return old;
        });
        return { oldData };
      },
      onError: (error, _, context) => {
        queryClient.setQueryData(["allProjects"], context?.oldData);
        toaster("error", error as string);
      },
      onSuccess: () => {
        toaster("success", "Project successfully deleted. 🗑️");
      },
    },
  );
};
