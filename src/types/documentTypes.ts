export type DocumentType = {
  id: string;
  project_id: string;
  title: string;
  content: any;
  categories: string[];
  icon: string;
  parent: string | null;
  expanded: boolean;
  folder: boolean;
  public: boolean;
  template: boolean;
  sort: number;
  properties: any;
  alter_names: string[];
};

export type DocumentCreateType = Partial<Omit<DocumentType, "project_id">> & {
  project_id: string;
};
