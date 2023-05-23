import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";

import { baseURLS, createURLS, getURLS, updateURLs } from "../types/CRUDenums";
import { ProjectDetails, ProjectType, SwatchType } from "../types/ItemTypes/projectTypes";
import { FetchFunction } from "../utils/CRUD/CRUDFetch";
import { toaster } from "../utils/toast";

export const useGetAllProjects = (user_id: string, enabled: boolean) => {
  return useQuery<ProjectType[]>(
    ["allProjects"],
    async () => {
      try {
        console.log(user_id);
        return FetchFunction({
          url: `${baseURLS.baseServer}getallprojects`,
          method: "POST",
          body: JSON.stringify({ user_id }),
        });
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
      toaster("success", "Your project has been successfully created.");
    },
  });
};
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (variables: Partial<ProjectType> & { user_id: string }) =>
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
export const useGetSingleProject = (id: string, options?: UseQueryOptions) => {
  return useQuery<ProjectType>(
    ["singleProject", id],
    async () =>
      FetchFunction({ url: `${baseURLS.baseServer}${getURLS.getSingleProject}`, method: "POST", body: JSON.stringify({ id }) }),
    {
      enabled: options?.enabled,
      staleTime: 60 * 5 * 1000,
      onSuccess: options?.onSuccess,
    },
  );
};
export const useGetProjectMembers = (project_id: string, options?: UseQueryOptions) => {
  return useQuery<ProjectType>(
    ["projectMembers", project_id],
    async () =>
      FetchFunction({
        url: `${baseURLS.baseServer}${getURLS.getProjectMembers}`,
        method: "POST",
        body: JSON.stringify({ project_id }),
      }),
    {
      enabled: options?.enabled,
      staleTime: 60 * 5 * 1000,
      onSuccess: options?.onSuccess,
    },
  );
};
export const useGetProjectDetails = (id: string, options?: UseQueryOptions) => {
  return useQuery<ProjectDetails>(
    ["singleProjectDetails", id],
    async () =>
      FetchFunction({
        url: `${baseURLS.baseServer}${getURLS.getSingleProjectDetails}`,
        method: "POST",
        body: JSON.stringify({ project_id: id }),
      }),
    {
      enabled: options?.enabled,
      staleTime: 60 * 5 * 1000,
      onSuccess: options?.onSuccess,
    },
  );
};
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, user_id }: { id: string; user_id: string }) => {
      if (id) {
        const url = `${baseURLS.baseServer}deleteproject`;
        if (url) return FetchFunction({ url, method: "DELETE", body: JSON.stringify({ id, user_id }) });
      }
      return null;
    },
    {
      onMutate: (variables) => {
        const oldData = queryClient.getQueryData(["allProjects"]);
        queryClient.setQueryData(["allProjects"], (old: ProjectType[] | undefined) => {
          if (old) {
            return old.filter((project) => project.id !== variables.id);
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

export const useCreateSwatch = (project_id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (variables) =>
      FetchFunction({
        url: `${baseURLS.baseServer}${createURLS.createSwatch}`,
        method: "POST",
        body: JSON.stringify(variables),
      }),
    {
      onError: () => {
        toaster("error", "There was an error creating this swatch.");
      },
      onMutate: (variables: SwatchType) => {
        queryClient.setQueryData(["singleProject", project_id], (old: ProjectType | undefined) => {
          if (old) return { ...old, swatches: [...old.swatches, variables] };
          return old;
        });
      },
      onSuccess: () => {
        toaster("success", "Your swatch has been successfully created.");
      },
    },
  );
};
export const useUpdateSwatch = (project_id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (variables: Partial<SwatchType>) =>
      FetchFunction({
        url: `${baseURLS.baseServer}${updateURLs.updateSwatch}`,
        method: "POST",
        body: JSON.stringify(variables),
      }),
    {
      onError: () => {
        toaster("error", "There was an error creating this swatch.");
      },
      onMutate: (variables: Partial<SwatchType>) => {
        queryClient.setQueryData(["singleProject", project_id], (old: ProjectType | undefined) => {
          if (old)
            return {
              ...old,
              swatches: [...(old.swatches || [])].map((swatch) => {
                if (swatch.id === variables.id) return { ...swatch, ...variables };
                return swatch;
              }),
            };
          return old;
        });
      },
      onSuccess: () => {
        toaster("success", "Your swatch has been successfully created.");
      },
    },
  );
};
export const useDeleteSwatch = (project_id: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, user_id }: { id: string; user_id: string }) => {
      if (id) {
        const url = `${baseURLS.baseServer}deleteswatch`;
        if (url) return FetchFunction({ url, method: "DELETE", body: JSON.stringify({ id, user_id }) });
      }
      return null;
    },
    {
      onMutate: (variables) => {
        const oldData = queryClient.getQueryData(["singleProject", project_id]);
        queryClient.setQueryData(["singleProject", project_id], (old: ProjectType | undefined) => {
          if (old) {
            return { ...old, swatches: (old?.swatches || []).filter((swatch) => swatch.id !== variables.id) };
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
        toaster("success", "Swatch successfully deleted. 🗑️");
      },
    },
  );
};
