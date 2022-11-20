export type MapType = {
  id: string;
  project_id: string;
  title: string;
  folder: boolean;
  public: boolean;
  expanded: boolean;
  sort: number;
  tags: string[];
  parent: string | null;
  map_image?: string;
};

export type MapCreateType = Partial<Omit<MapType, "project_id">> & {
  project_id: string;
};

export type DefaultMapType = Omit<MapType, "id" | "project_id">;
