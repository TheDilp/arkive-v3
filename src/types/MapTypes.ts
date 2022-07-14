import { ImageProps } from "../custom-types";

export type MapProps = {
  id: string;
  title: string;
  map_image?: ImageProps;
  parent: { id: string; title: string } | null;
  project_id: string;
  markers: MapMarkerProps[];
  layers: MapLayerProps[];
  folder: boolean;
  expanded: boolean;
  public: boolean;
  sort: number;
};
export type MapMarkerProps = {
  id: string;
  icon: string;
  color: string;
  backgroundColor: string;
  lat: number;
  lng: number;
  text: string;
  map_id: string;
  doc_id?: string;
  map_link?: string;
};

export type MapLayerProps = {
  id: string;
  title: string;
  image: string;
  map_link: string;
};

export type MapItemDisplayDialogProps = {
  id: string;
  title: string;
  map_image: ImageProps;
  parent: string;
  folder: boolean;
  depth: number;
  public: boolean;
  show: boolean;
};

export type CreateMapInputs = {
  title: string;
  map_image: ImageProps;
  parent: string;
  folder: boolean;
};
export type CreateMarkerInputs = {
  icon: string;
  text: string;
  color: string;
  doc_id: string;
  map_link: string;
};

export type MapCreateProps = {
  id: string;
  title: string;
  map_image: string | undefined;
  project_id: string;
  parent?: string | null;
  folder?: boolean;
  expanded: false;
};

export type MapUpdateProps = {
  id: string;
  title?: string;
  map_image?: ImageProps;
  parent?: string | null;
  expanded?: boolean;
  public?: boolean;
};

export type CreateMapMarkerProps = {
  id: string;
  map_id: string;
  lat: number;
  lng: number;
  icon?: string;
  color?: string;
  backgroundColor?: string;
  text?: string;
  doc_id?: string;
  map_link?: string;
};

export type UpdateMapMarkerProps = {
  id: string;
  map_id: string;
  text?: string;
  icon?: string;
  color?: string;
  backgroundColor?: string;
  lat?: number;
  lng?: number;
  doc_id?: string;
  map_link?: string;
};

export type UpdateMarkerInputs = {
  id: string;
  text: string;
  icon: string;
  color: string;
  backgroundColor: string;
  doc_id?: string | undefined;
  map_link?: string | undefined;
  show: boolean;
};
