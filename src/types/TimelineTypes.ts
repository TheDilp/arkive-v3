import { ImageProps } from "../custom-types";

export type TimelineType = {
  id: string;
  title: string;
  project_id: string;
  folder: boolean;
  expanded: boolean;
  sort: number;
  public: boolean;
  timeline_events: TimelineEventType[];
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

export type TimelineUpdateType = {
  id: string;
  project_id: string;
  title?: string;
  expanded?: boolean;
  sort?: number;
  public?: boolean;
  parent?: string | null;
};

export type TimelineItemDisplayDialogProps = {
  id: string;
  title: string;
  parent: string;
  folder: boolean;
  depth: number;
  public: boolean;
  show: boolean;
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
  image: ImageProps;
  icon: string;
  public: boolean;
};
