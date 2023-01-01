import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { AvailableItemTypes } from "../types/generalTypes";
import { getSingleURL } from "../utils/CRUD/CRUDUrls";

export function useGetItem<ItemType>(id: string, type: AvailableItemTypes, options?: UseQueryOptions) {
  const { data, isLoading } = useQuery<ItemType>({
    queryKey: [type, id],
    queryFn: async () => {
      const url = getSingleURL(type, id);
      if (url) {
        const res = await fetch(url, {
          method: "GET",
        });
        const resData = await res.json();
        return resData;
      }

      return null;
    },
    enabled: options?.enabled,
  });

  return { data, isLoading };
}
