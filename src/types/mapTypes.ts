// Map Pins
export type MapPinType = {
  id: string;
  parent: string;
  lat: number;
  lng: number;
  color: string;
  backgroundColor: string;
  icon: string;
  public: boolean;
  text?: string;
  map_link?: string;
  doc_id?: string;
};

// Map Layers
export type MapLayerType = {
  id: string;
  parent: string;
  title: string;
  image: string;
  public: boolean;
};

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
  map_pins: MapPinType[];
  map_layers: MapLayerType[];
};

export type MapCreateType = Partial<Omit<MapType, "project_id">> & {
  project_id: string;
};

export type DefaultMapType = Omit<MapType, "id" | "project_id">;

export type MapPinCreateType = Partial<Omit<MapPinType, "parent">> & {
  parent: string;
};
export type DefaultMapPinType = Omit<MapPinType, "id" | "parent">;
