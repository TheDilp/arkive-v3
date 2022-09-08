export type TimelineType = {
  id: string;
  title: string;
  project_id: string;
  folder: boolean;
  expanded: boolean;
  sort: number;
  public: boolean;
  parent: { id: string; title: string } | null;
};

export type TimelineCreateType = {
  id: string;
  title: string;
  project_id: string;
  folder: boolean;
  parent: string | null;
  expanded: boolean;
};

// Timeline Events
export type TimelineEventType = {
  id: string;
  title: string;
  start: string;
  end: string;
  timeline_id: string;
  doc_id: string;
  map_id: string;
  image: string;
  icon: string;
  public: boolean;
};
