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
  categories: Omit<Category, "doc_id">[];
  title: string;
  parent: { id: string; title: string } | null;
  folder: boolean;
  icon: string;
};
export type Category = {
  id: string;
  tag: string;
  doc_id?: string;
};
export type treeItemDisplayDialog = {
  id: string;
  title: string;
  show: boolean;
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
