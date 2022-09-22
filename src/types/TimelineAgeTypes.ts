export type TimelineAgeType = {
  id: string;
  title: string;
  timeline_id: string;
  color: string;
  sort: number;
};

export type TimelineAgeCreateType = {
  id: string;
  title: string;
  timeline_id: string;
  color: string;
  sort: number;
};

export type TimelineAgeUpdateType = {
  id: string;
  timeline_id: string;
  title?: string;
  color?: string;
  sort?: number;
};
