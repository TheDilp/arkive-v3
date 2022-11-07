export type DocumentType = {
  id: string;
  project_id: string;
  title: string;
  content: object | null;
  categories: string[];
  icon: string;
  parent: string | null;
  expanded: boolean;
  folder: boolean;
  public: boolean;
  template: boolean;
  sort: number;
  properties?: object;
  alter_names: string[];
};
