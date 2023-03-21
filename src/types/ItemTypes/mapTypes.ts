/* eslint-disable no-use-before-define */
import { BaseItemType } from "../generalTypes";

// Map Pins
export type MapPinType = {
  id: string;
  parentId: string;
  parent: MapType;
  lat: number;
  lng: number;
  color: string;
  backgroundColor: string;
  borderColor: string;
  showBorder: boolean;
  showBackground: boolean;
  icon?: string;
  image?: string;

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
  clusterPins: boolean;
}

export type MapCreateType = Partial<Omit<MapType, "project_id">> & {
  project_id: string;
};

export type DefaultMapType = Omit<MapType, "id" | "project_id" | "map_layers" | "map_pins" | "sort">;

export type MapPinCreateType = Partial<Omit<MapPinType, "parent">>;
export type DefaultMapPinType = Omit<MapPinType, "id">;
