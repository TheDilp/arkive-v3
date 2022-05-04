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
  expanded: boolean;
};

export type Map = {
  id: string;
  title: string;
  map_image: string;
  parent: string;
  folder: boolean;
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
  doc_id?: string;
  map_link?: string;
};
export type Board = {
  id: string;
  title: string;
  project_id: string;
  nodes: Node[];
};
export type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  source?: string;
  target?: string;
  board_id: string;
};
export type CytoscapeNode = {
  data: {
    id: string;
    label: string;
  };
  position: {
    x: number;
    y: number;
  };
};
export type docItemDisplayDialog = {
  id: string;
  title: string;
  show: boolean;
  folder: boolean;
  template: boolean;
  depth: number;
};
export type mapItemDisplayDialog = {
  id: string;
  title: string;
  map_image: string;
  parent: string;
  show: boolean;
  folder: boolean;
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

export type CreateMapInputs = {
  title: string;
  map_image: string;
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

export type UpdateMarkerInputs = {
  icon: string;
  text: string;
  color: string;
  doc_id?: string;
  map_link?: string;
};

export type RegisterInputs = {
  email: string;
  password: string;
};
