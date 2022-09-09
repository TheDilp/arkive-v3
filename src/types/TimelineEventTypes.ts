import { ImageProps } from "../custom-types";

export type TimelineEventType = {
  id: string;
  title: string;
  start_day?: number;
  start_month?: number;
  start_year: number;
  end_day?: number;
  end_month?: number;
  end_year: number;
  timeline_id: string;
  doc_id?: string | null;
  map_id?: string | null;
  image?: ImageProps;
  icon: string;
  public: boolean;
};

export type TimelineEventCreateType = {
  id: string;
  title: string;
  start_day?: number;
  start_month?: number;
  start_year: number;
  end_day?: number;
  end_month?: number;
  end_year: number;
  timeline_id: string;
  doc_id?: string;
  map_id?: string;
  image?: ImageProps;
  icon: string;
  public: boolean;
};

export type TimelineEventUpdateType = {
  id: string;
  timeline_id: string;
  title?: string;
  start_day?: number;
  start_month?: number;
  start_year?: number;
  end_day?: number;
  end_month?: number;
  end_year?: number;
  doc_id?: string;
  map_id?: string;
  image?: ImageProps;
  icon?: string;
  public?: boolean;
};