import { baseURLS, createURLS, getURLS } from "../types/CRUDenums";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectType } from "../types/projectTypes";

export const useGetAllProjects = () => {
  return useQuery(
    ["allProjects"],
    async () =>
      await (
        await fetch(`${baseURLS.baseServer}${getURLS.getAllProjects}`, {
          method: "GET",
        })
      ).json(),
  );
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async () =>
      await fetch(`${baseURLS.baseServer}${createURLS.createProject}`, {
        method: "POST",
      }),
    {
      onSuccess: async (data) => {
        const newData: ProjectType = await data.json();
        queryClient.setQueryData(
          ["allProjects"],
          (old: ProjectType[] | undefined) => {
            if (old) return [...old, newData];
            else return [newData];
          },
        );
      },
    },
  );
};
export const useGetSingleProject = (id: string) => {
  return useQuery(
    ["singleProject", id],
    async () =>
      await (
        await fetch(`http://localhost:8080/getSingleProject/${id}`, {
          method: "GET",
        })
      ).json(),
    {
      staleTime: 60 * 5 * 1000,
    },
  );
};
