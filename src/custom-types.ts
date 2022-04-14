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
  content: RemirrorJSON;
  image: string;
  user_id: string;
  project_id: string;
  categories: string[];
  title: string;
  parent: { id: string; title: string } | null;
  folder: boolean;
};

export type treeItemDisplayDialog = {
  id: string;
  title: string;
  show: boolean;
};
