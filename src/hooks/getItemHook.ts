import { useQueryClient } from "@tanstack/react-query";
import { DocumentType } from "../types/documentTypes";
import { AvailableItemTypes } from "../types/generalTypes";
import { MapType } from "../types/mapTypes";

export function useGetItem(project_id: string, id: null | string, type: AvailableItemTypes) {
  const queryClient = useQueryClient();
  if (!id) return null;
  if (type === "documents") {
    const data = queryClient.getQueryData<DocumentType[]>(["allDocuments", project_id]);
    if (data) {
      const item = data.find((item) => item.id === id);
      if (item) return item;
      return null;
    }
    return null;
  }
  if (type === "maps") {
    const data = queryClient.getQueryData<MapType[]>(["allMaps", project_id]);
    if (data) {
      const item = data.find((item) => item.id === id);
      if (item) return item;
      return null;
    }
    return null;
  }
  return null;
}
