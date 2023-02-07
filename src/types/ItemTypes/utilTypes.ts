export type CreateType<ItemType> = Partial<Omit<ItemType, "project_id">> & {
  project_id: string;
};
