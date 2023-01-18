import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { baseURLS, createURLS, getURLS, updateURLs } from "../types/CRUDenums";
import { ProjectType } from "../types/projectTypes";
import { toaster } from "../utils/toast";

export const useGetAllProjects = (enabled: boolean) => {
  return useQuery(
    ["allProjects"],
    async () =>
      (
        await fetch(`${baseURLS.baseServer}${getURLS.getAllProjects}`, {
          method: "GET",
        })
      ).json(),
    {
      enabled,
    },
  );
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async () =>
      fetch(`${baseURLS.baseServer}${createURLS.createProject}`, {
        method: "POST",
      }),
    {
      onSuccess: async (data) => {
        const newData: ProjectType = await data.json();
        queryClient.setQueryData(["allProjects"], (old: ProjectType[] | undefined) => {
          if (old) return [...old, newData];
          return [newData];
        });
      },
    },
  );
};
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (variables: Partial<ProjectType>) =>
      fetch(`${baseURLS.baseServer}${updateURLs.updateProject}${variables.id}`, {
        method: "POST",
        body: JSON.stringify(variables),
      }),
    {
      onSuccess: async (data, variables) => {
        queryClient.refetchQueries({ queryKey: ["singleProject", variables?.id] });
        toaster("success", "This project has been successfully updated.");
      },
    },
  );
};
export const useGetSingleProject = (id: string) => {
  return useQuery<ProjectType>(
    ["singleProject", id],
    async () =>
      (
        await fetch(`${baseURLS.baseServer}${getURLS.getSingeProject}/${id}`, {
          method: "GET",
        })
      ).json(),
    {
      staleTime: 60 * 5 * 1000,
    },
  );
};
