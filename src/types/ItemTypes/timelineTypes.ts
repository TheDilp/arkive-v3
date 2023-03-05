import { BaseItemType } from "../generalTypes";

export interface TimelineType extends BaseItemType {
  id: string;
  title: string;

  parent?: TimelineType;
}

export type TimelineCreateType = Partial<Omit<TimelineType, "project_id">>;

export type DefaultTimelineType = Pick<TimelineType, "title" | "project_id">;
