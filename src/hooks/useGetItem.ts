import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { AvailableItemTypes } from "../types/generalTypes";
import { FetchFunction } from "../utils/CRUD/CRUDFetch";
import { getPublicURL, getSingleURL } from "../utils/CRUD/CRUDUrls";

export function useGetItem<ItemType>(id: string, type: AvailableItemTypes, options?: UseQueryOptions, isPublic?: boolean) {
  const { data, isLoading } = useQuery<ItemType>({
    queryKey: [type, id],
    queryFn: async () => {
      const url = isPublic ? getPublicURL(type) : getSingleURL(type);
      if (url) {
        return FetchFunction({ url, method: "POST", body: JSON.stringify({ id }) });
      }

      return null;
    },
    enabled: options?.enabled,
  });

  return { data, isLoading };
}
