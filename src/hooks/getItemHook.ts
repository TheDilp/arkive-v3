import { useQuery } from "@tanstack/react-query";

import { DocumentType } from "../types/documentTypes";
import { AvailableItemTypes } from "../types/generalTypes";
import { MapType } from "../types/mapTypes";

export function useGetItem(project_id: string, id: null | string, type: AvailableItemTypes) {
  const { data, isLoading, isError } = useQuery<(DocumentType | MapType)[]>(["allItems", project_id, type]);
  if (!id || !type || isLoading || isError) return null;
  if (data) {
    const item = data.find((dataItem) => dataItem.id === id);
    if (item) return item;
    return null;
  }
  return null;
}
