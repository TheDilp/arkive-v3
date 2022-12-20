import { useQuery } from "@tanstack/react-query";

import { AllItemsType, AvailableItemTypes } from "../types/generalTypes";
import { getSingleURL } from "../utils/CRUD/CRUDUrls";

export function useGetItem(id: string, type: AvailableItemTypes) {
  const { data, isLoading } = useQuery<AllItemsType>({
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
  });

  return { data, isLoading };
}
