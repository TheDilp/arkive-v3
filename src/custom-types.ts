import { RemirrorJSON } from "@remirror/core";
export type ProjectProps = {
  id: string;
  backgroundImage: string;
  cardImage: string;
  logoImage: string;
  title: string;
  user_id: string;
  categories: string[];
  createdAt: Date;
};

export type DocumentProps = {
  id: string;
  title: string;
  content: RemirrorJSON | null;
  image?: ImageProps;
  project_id: string;
  categories: string[];
  parent: { id: string; title: string } | null;
  nodes?: {
    id: string;
    label: string;
    sources?: { id: string; target: { id: string; label: string } }[];
    targets?: { id: string; source: { id: string; label: string } }[];
  }[];
  icon: string;
  folder: boolean;
  template: boolean;
  expanded: boolean;
  public: boolean;
  sort: number;
};

export type MapProps = {
  id: string;
  title: string;
  map_image?: ImageProps;
  parent: { id: string; title: string } | null;
  project_id: string;
  markers: MapMarkerProps[];
  folder: boolean;
  expanded: boolean;
  public: boolean;
  sort: number;
};
export type MapMarkerProps = {
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

export type ImageProps = {
  id: string;
  title: string;
  link: string;
  type: "Image" | "Map";
};

export type DocItemDisplayDialogProps = {
  id: string;
  title: string;
  show: boolean;
  folder: boolean;
  parent: string | null;
  template: boolean;
  depth: number;
  root?: boolean;
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


export type IconSelectProps = {
  id: string;
  icon: string;
  top: number;
  left: number;
  show: boolean;
};

export type ProfileProps = {
  id: string;
  nickname: string;
  user_id: string;
  profile_image: string;
};

export type UserProfileProps = {
  user_id: string;
  nickname: string;
};

// Inputs for creating
export type CreateDocumentInputs = {
  title: string;
  image: string;
  parent: string | null;
  icon: string;
  folder: boolean;
  template: string;
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

// Inputs for updating
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

// DATA CREATION AND UPDATE TYPES

export type DocumentCreateProps = {
  id?: string;
  title?: string;
  icon?: string;
  image?: string;
  project_id: string;
  parent?: string | null;
  categories?: string[];
  folder?: boolean;
  content?: RemirrorJSON | null;
};
export type DocumentUpdateProps = {
  id: string;
  title?: string;
  content?: RemirrorJSON | null;
  parent?: string | null;
  categories?: string[];
  image?: string;
  icon?: string;
  folder?: boolean;
  expanded?: boolean;
  public?: boolean;
  sort?: number;
};

export type TemplateCreateProps = {
  id: string;
  title: string;
  content: RemirrorJSON;
  project_id: string;
  icon?: string;
  image?: string;
  parent?: string | null;
  categories?: string[];
  folder?: boolean;
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
  lat?: number;
  lng?: number;
  doc_id?: string;
  map_link?: string;
};


// OTHER

export type breadcrumbsProps = { template: React.ReactNode }[];
