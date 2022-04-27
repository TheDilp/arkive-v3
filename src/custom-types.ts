import { RemirrorJSON } from "@remirror/core";
export type Project = {
  id: string;
  backgroundImage: string;
  cardImage: string;
  logoImage: string;
  title: string;
  user_id: string;
  categories: string[];
  createdAt: Date;
};

export type Document = {
  id: string;
  title: string;
  content: RemirrorJSON | null;
  image: string;
  user_id: string;
  project_id: string;
  categories: string[];
  parent: { id: string; title: string } | null;
  folder: boolean;
  icon: string;
  template: boolean;
};

export type Map = {
  id: string;
  title: string;
  map_image: string;
  parent: string;
  user_id: string;
  project_id: string;
  markers: MapMarker[];
};
export type MapMarker = {
  id: string;
  icon: string;
  color: string;
  lat: number;
  lng: number;
  text: string;
  map_id: string;
};
export type treeItemDisplayDialog = {
  id: string;
  title: string;
  show: boolean;
  folder: boolean;
  template: boolean;
  depth: number;
};

export type iconSelect = {
  doc_id: string;
  icon: string;
  top: number;
  left: number;
  show: boolean;
};

export type Profile = {
  id: string;
  nickname: string;
  user_id: string;
  profile_image: string;
};

export type UserProfileType = {
  user_id: string;
  nickname: string;
};

export type CreateDocumentInputs = {
  title: string;
  image: string;
  parent: string;
  icon: string;
  folder: boolean;
  template: string;
};

export type RegisterInputs = {
  email: string;
  password: string;
};
