import { useMutation, useQuery } from "@tanstack/react-query";

import { baseURLS, getURLS } from "../types/CRUDenums";
import { AvailableItemTypes } from "../types/generalTypes";

export const useGetAllTags = (project_id: string, type: AvailableItemTypes) => {
  return useQuery<string[]>(
    ["allTags", project_id, type],
    async () =>
      (
        await fetch(`${baseURLS.baseServer}${getURLS.getAllTags}${type}/${project_id}`, {
          method: "GET",
        })
      ).json(),
    {
      staleTime: 5 * 60 * 1000,
    },
  );
};

export const useFullSearch = (project_id: string) => {
  return useMutation(async (query: string) =>
    (
      await fetch(`${baseURLS.baseServer}${getURLS.getFullSearch}${project_id}`, {
        method: "POST",
        body: JSON.stringify({ query }),
      })
    ).json(),
  );
};