export type DocumentType = {
  id: string;
  title: string;
  content: JSON | null;
  categories: string[];
  icon: string;
  parent: string | ParentType;
  expanded: boolean;
  folder: boolean;
  public: boolean;
  template: boolean;
  sort: number;
  properties?: JSON;
  alter_names: string[];
};

export type ParentType = {
  id: string;
  title: string;
};
