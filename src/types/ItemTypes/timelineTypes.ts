import { BaseItemType } from "../generalTypes";
import { CalendarType, EventType } from "./calendarTypes";

export interface TimelineDisplayEventType extends EventType {
  displayYear: number;
}

export interface TimelineType extends BaseItemType {
  id: string;
  title: string;

  parent?: TimelineType;
  calendars: (Omit<CalendarType, "events"> & { events: TimelineDisplayEventType[] })[];
  events: TimelineDisplayEventType[];
}

export type TimelineCreateType = Partial<Omit<TimelineType, "project_id">>;

export type DefaultTimelineType = Pick<TimelineType, "title" | "project_id">;

export type TimelineViewType = "Vertical" | "Horizontal" | "Grouped";
export type TimelineModeType = "Simple" | "Detailed";

export type TimelineViewSettings = {
  groupBy: boolean;
  view: { label: TimelineViewType; value: TimelineViewType };
  mode: { label: TimelineModeType; value: TimelineModeType };
};
