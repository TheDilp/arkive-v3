import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { baseURLS } from "../types/CRUDenums";
import { AvailableItemTypes } from "../types/generalTypes";
import { FetchFunction } from "../utils/CRUD/CRUDFetch";
import { getSingleURL } from "../utils/CRUD/CRUDUrls";

export function useGetItem<ItemType>(id: string, type: AvailableItemTypes, options?: UseQueryOptions, isPublic?: boolean) {
  const { data, isLoading } = useQuery<ItemType>({
    queryKey: [type, id],
    queryFn: async () => {
      const url = isPublic ? `${baseURLS.baseServer}getpublic${type.slice(0, type.length - 1)}` : getSingleURL(type);
      if (url) {
        return FetchFunction({ url, method: "POST", body: JSON.stringify({ id }) });
      }

      return null;
    },
    enabled: options?.enabled,
  });

  return { data, isLoading };
}
