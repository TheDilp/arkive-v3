import { BaseItemType } from "../generalTypes";

// Map Pins
export type MapPinType = {
  id: string;
  parentId: string;
  lat: number;
  lng: number;
  color: string;
  backgroundColor: string;
  icon: string;
  isPublic: boolean;
  text?: string;
  map_link?: string;
  doc_id?: string;
};

// Map Layers
export type MapLayerType = {
  id: string;
  parentId: string;
  title: string;
  image: string;
  isPublic: boolean;
};

export interface MapType extends BaseItemType {
  image?: string;
  parent?: MapType;
  map_pins: MapPinType[];
  map_layers: MapLayerType[];
}

export type MapCreateType = Partial<Omit<MapType, "project_id">> & {
  project_id: string;
};

export type DefaultMapType = Omit<MapType, "id" | "project_id" | "map_layers" | "map_pins" | "sort">;

export type MapPinCreateType = Partial<Omit<MapPinType, "parent">>;
export type DefaultMapPinType = Omit<MapPinType, "id">;
