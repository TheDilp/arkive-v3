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
  alter_names: string[];
  icon: string;
  folder: boolean;
  template: boolean;
  expanded: boolean;
  public: boolean;
  sort: number;
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

// Inputs for updating

export type RegisterInputs = {
  email: string;
  password: string;
};

// DATA CREATION AND UPDATE TYPES

export type DocumentCreateProps = {
  id: string;
  title: string;
  icon: string;
  project_id: string;
  parent: string | null;
  categories: string[];
  folder: boolean;
  template: boolean;
  content: RemirrorJSON | null;
  image?: ImageProps | undefined;
};
export type DocumentUpdateProps = {
  id: string;
  title?: string;
  content?: RemirrorJSON | null;
  parent?: string | null;
  categories?: string[];
  image?: string;
  icon?: string;
  alter_names?: string[];
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

// OTHER

export type breadcrumbsProps = { template: React.ReactNode }[];

export type pricingTierProps = {
  title: string;
  price: string;
  features: string[];
};

export type featureBlockProps = {
  title: string;
  description: string;
  icon: string;
};

export type slashMenuItem = {
  name: string;
  type:
    | "heading"
    | "list"
    | "quote"
    | "callout"
    | "image"
    | "divider"
    | "columns_select"
    | "columns"
    | "secret"
    | "map_select"
    | "map"
    | "board_select"
    | "board";
  icon: string;
  map_id?: string;
  board_id?: string;
  level?: number;
  callout_type?: string;
  color?: string;
  column_count?: number;
};
