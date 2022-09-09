import { ImageProps } from "../custom-types";

export type TimelineEventType = {
  id: string;
  title: string;
  start: string;
  end: string;
  timeline_id: string;
  doc_id: string | null;
  map_id: string | null;
  image: ImageProps | null;
  icon: string;
  public: boolean;
};

export type TimelineEventCreateType = {
  id: string;
  title: string;
  start: string;
  end: string;
  timeline_id: string;
  doc_id?: string;
  map_id?: string;
  image?: string;
  icon: string;
  public: boolean;
};

export type TimelineEventUpdateType = {
  id: string;
  title?: string;
  start?: string;
  end?: string;
  doc_id?: string;
  map_id?: string;
  image?: string;
  icon?: string;
  public?: boolean;
};
