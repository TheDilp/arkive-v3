import { useMutation, useQuery } from "@tanstack/react-query";

import { baseURLS, deleteURLs, getURLS } from "../types/CRUDenums";
import { AvailableItemTypes, SettingsTagsResults } from "../types/generalTypes";

export const useGetAllTags = (project_id: string) => {
  return useQuery<string[]>(
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
  return useQuery<SettingsTagsResults>(
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

export const useDeleteTagsFromAllItems = (project_id: string) => {
  return useMutation(async (items: { id: string; tags: string[]; type: AvailableItemTypes | "nodes" | "edges" }[]) =>
    fetch(`${baseURLS.baseServer}${deleteURLs.deleteTagsFromAllItems}${project_id}`, {
      method: "DELETE",
      body: JSON.stringify({ items }),
    }),
  );
};
