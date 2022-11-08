import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectType } from "../types/projectTypes";

export const useGetAllProjects = () => {
  return useQuery(
    ["allProjects"],
    async () =>
      await (
        await fetch("http://localhost:8080/getAllProjects", { method: "GET" })
      ).json()
  );
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async () =>
      await fetch("http://localhost:8080/createProject", { method: "POST" }),
    {
      onMutate: (newProject: ProjectType) => {
        const oldProjects = queryClient.getQueryData(["allProjects"]);

        queryClient.setQueryData(
          ["allProjects"],
          (old: ProjectType[] | undefined) => {
            if (!old) return [];
            return [...old, newProject];
          }
        );

        return { oldProjects };
      },
      onError: (_, variables, context) => {
        queryClient.setQueryData(["allProjects"], context?.oldProjects);
      },
    }
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
    }
  );
};
