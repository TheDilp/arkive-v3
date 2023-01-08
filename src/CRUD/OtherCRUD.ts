import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { baseURLS, createURLS, deleteURLs, getURLS, updateURLs } from "../types/CRUDenums";
import { TagCreateType, TagSettingsType, TagType, TagUpdateType } from "../types/generalTypes";

export const useGetAllTags = (project_id: string) => {
  return useQuery<TagType[]>(
    ["allTags", project_id],
    async () =>
      (
        await fetch(`${baseURLS.baseServer}${getURLS.getAllTags}${project_id}`, {
          method: "GET",
        })
      ).json(),
    {
      staleTime: 5 * 60 * 1000,
    },
  );
};

export const useFullSearch = (project_id: string) => {
  return useMutation(async ({ query, type }: { query: string | string[]; type: "namecontent" | "tags" }) =>
    (
      await fetch(`${baseURLS.baseServer}${getURLS.getFullSearch}${project_id}/${type}`, {
        method: "POST",
        body: JSON.stringify({ query }),
      })
    ).json(),
  );
};

export const useGetTagSettings = (project_id: string) => {
  return useQuery<TagSettingsType[]>(
    ["tagsSettings", project_id],
    async () =>
      (
        await fetch(`${baseURLS.baseServer}${getURLS.getAllSettingsTags}${project_id}`, {
          method: "GET",
        })
      ).json(),
    {
      staleTime: 5 * 60 * 1000,
    },
  );
};

export const useCreateTag = (project_id: string) => {
  return useMutation(async (variables: TagCreateType) =>
    fetch(`${baseURLS.baseServer}${createURLS.createTag}`, {
      method: "POST",
      body: JSON.stringify({ project_id, ...variables }),
    }),
  );
};
export const useUpdateTag = () => {
  return useMutation(async (variables: Partial<Omit<TagUpdateType, "project_id">> & { id: string }) =>
    (
      await fetch(`${baseURLS.baseServer}${updateURLs.updateTag}${variables.id}`, {
        method: "POST",
        body: JSON.stringify({ ...variables }),
      })
    ).json(),
  );
};
export const useDeleteTags = (project_id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (ids: string[]) =>
      (
        await fetch(`${baseURLS.baseServer}${deleteURLs.deleteTags}`, {
          method: "DELETE",
          body: JSON.stringify({ ids }),
        })
      ).json(),
    {
      onMutate: (variables) => {
        const oldData = queryClient.getQueryData(["tagsSettings", project_id]);

        queryClient.setQueryData(["tagsSettings", project_id], (old: TagType[] | undefined) => {
          if (old) {
            return old.filter((tag) => !variables.includes(tag.id));
          }
          return old;
        });
        queryClient.refetchQueries(["allItems", project_id]);
        return { oldData };
      },
      onError: (_, __, context) => {
        return context?.oldData;
      },
    },
  );
};
