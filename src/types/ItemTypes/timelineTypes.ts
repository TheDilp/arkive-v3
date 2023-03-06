import { BaseItemType } from "../generalTypes";
import { CalendarType } from "./calendarTypes";

export interface TimelineType extends BaseItemType {
  id: string;
  title: string;

  parent?: TimelineType;
  calendars: CalendarType[];
}

export type TimelineCreateType = Partial<Omit<TimelineType, "project_id">>;

export type DefaultTimelineType = Pick<TimelineType, "title" | "project_id">;

export type TimelineViewSettings = { groupByHour: boolean };
