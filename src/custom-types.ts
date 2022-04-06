export type Project = {
  id: string;
  backgroundImage: string;
  cardImage: string;
  logoImage: string;
  title: string;
  user_id: string;
  categories: JSON[];
  createdAt: Date;
};

export type Document = {
  id: string;
  content: JSON;
  image: string;
  user_id: string;
  project_id: string;
  categories: string[];
  title: string;
  parent: string;
  folder: boolean;
};
