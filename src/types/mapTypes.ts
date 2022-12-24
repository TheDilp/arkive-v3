import { BaseItemType } from "./generalTypes";

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

export interface MapType extends BaseItemType {
  image?: string;
  map_pins: MapPinType[];
  map_layers: MapLayerType[];
}

export type MapCreateType = Partial<Omit<MapType, "project_id">> & {
  project_id: string;
};

export type DefaultMapType = Omit<MapType, "id" | "project_id" | "map_layers" | "map_pins">;

export type MapPinCreateType = Partial<Omit<MapPinType, "parent">> & {
  parent: string;
};
export type DefaultMapPinType = Omit<MapPinType, "id">;
