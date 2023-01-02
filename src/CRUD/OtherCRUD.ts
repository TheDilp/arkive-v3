import { useMutation, useQuery } from "@tanstack/react-query";

import { EdgeType, NodeType } from "../types/boardTypes";
import { baseURLS, getURLS } from "../types/CRUDenums";
import { AllItemsType } from "../types/generalTypes";

export const useGetAllTags = (project_id: string) => {
  return useQuery<string[]>(
    ["allTags", project_id],
    async () =>
      (
        await fetch(`${baseURLS.baseServer}${getURLS.getAllTags}${project_id}`, {
          method: "POST",
          body: JSON.stringify({}),
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
  return useQuery<(AllItemsType | NodeType | EdgeType)[]>(
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
