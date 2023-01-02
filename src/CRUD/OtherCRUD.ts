import { useMutation, useQuery } from "@tanstack/react-query";

import { baseURLS, createURLS, deleteURLs, getURLS, updateURLs } from "../types/CRUDenums";
import { AvailableItemTypes, TagCreateType, TagSettingsType, TagType, TagUpdateType } from "../types/generalTypes";

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

export const useDeleteTagsFromAllItems = (project_id: string) => {
  return useMutation(async (items: { id: string; tags: string[]; type: AvailableItemTypes | "nodes" | "edges" }[]) =>
    fetch(`${baseURLS.baseServer}${deleteURLs.deleteTagsFromAllItems}${project_id}`, {
      method: "DELETE",
      body: JSON.stringify({ items }),
    }),
  );
};
