import { RemirrorJSON } from "@remirror/core";
export type Project = {
  id: string;
  backgroundImage: string;
  cardImage: string;
  logoImage: string;
  title: string;
  user_id: string;
  users?: UserPermissionType[];
  profiles?: UserProfileType[];
  categories: string[];
  createdAt: Date;
};

export type Document = {
  id: string;
  title: string;
  content: RemirrorJSON;
  image: string;
  user_id: string;
  project_id: string;
  categories: string[];
  parent: { id: string; title: string } | null;
  folder: boolean;
  icon: string;
  view_by: string[];
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

export type UserPermissionType = {
  user_id: string;
  role: string;
  profile: {
    nickname: string;
  };
};
export type UserProfileType = {
  user_id: string;
  nickname: string;
};
