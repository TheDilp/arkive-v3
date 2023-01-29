import { BaseItemType } from "../generalTypes";

export type DayType = {
  id: string;
  title: string;
};

export interface CalendarType extends BaseItemType {
  weeks: number;
  days: DayType[];
}

export type CalendarCreateType = Partial<Omit<CalendarType, "parentId">>;

export type DefaultCalendarType = Pick<CalendarType, "title" | "project_id">;
