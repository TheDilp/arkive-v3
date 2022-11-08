import { useGetSingleProject } from "../CRUD/ProjectCRUD";
import { AvailableItemTypes } from "../types/generalTypes";

export function useGetItem(
  project_id: string,
  id: string,
  type: AvailableItemTypes
) {
  const { data } = useGetSingleProject(project_id as string);

  if (data) {
    const item = data[type]?.find((item) => item.id === id);
    if (item) return item;
  }
  return null;
}
