import { useQueryClient } from "@tanstack/react-query";
import { DocumentType } from "../types/documentTypes";
import { AvailableItemTypes } from "../types/generalTypes";
import { MapType } from "../types/mapTypes";

export function useGetItem(project_id: string, id: null | string, type: AvailableItemTypes) {
  const queryClient = useQueryClient();
  if (!id || !type) return null;
  const data = queryClient.getQueryData<(DocumentType | MapType)[]>(["allItems", project_id, type]);
  if (data) {
    const item = data.find((item) => item.id === id);
    if (item) return item;
    return null;
  }
  return null;
}
