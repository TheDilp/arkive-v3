import { BaseItemType } from "../generalTypes";

export interface CalendarType extends BaseItemType {
  days: string[];
  weeks: number;
  months: string[];
}

export type CalendarCreateType = Partial<Omit<CalendarType, "parentId">>;

export type DefaultCalendarType = Pick<CalendarType, "title" | "project_id">;
