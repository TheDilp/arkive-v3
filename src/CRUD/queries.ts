import { useQuery } from "@tanstack/react-query";
import { baseURLS, getURLS } from "../types/CRUDenums";

export const useGetAllTags = (project_id: string) => {
  return useQuery<string[]>(
    ["allTags", project_id],
    async () =>
      await (
        await fetch(
          `${baseURLS.baseServer}${getURLS.getAllTags}${project_id}`,
          {
            method: "GET",
          },
        )
      ).json(),
    {
      staleTime: 5 * 60 * 1000,
    },
  );
};
