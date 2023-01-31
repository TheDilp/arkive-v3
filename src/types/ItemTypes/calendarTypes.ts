/* eslint-disable no-use-before-define */
import { BaseItemType } from "../generalTypes";

export interface CalendarType extends BaseItemType {
  id: string;
  title: string;

  hours?: number;
  minutes?: number;

  eras: EraType[];
  months: MonthType[];
  days: string[];
  event: EventType[];
}

export type EraType = {
  id: string;
  title: string;
  start_year: number;
  end_year: number;
  parentId: string;
  sort: number;

  events: EventType[];
};

export type MonthType = {
  id: string;
  title: string;
  days: number;
  sort: number;
  parentId: string;

  events: EventType[];
};

export type EventType = {
  id: string;
  title: string;
  year: number;

  era: EraType;
  month: MonthType;
  day: number;
  hours: number;
  minutes: number;

  erasId: string;
  monthsId: string;
  calendarsId: string | null;
};

export type CalendarCreateType = Partial<Omit<CalendarType, "parentId">>;
export type MonthCreateType = Partial<Omit<MonthType, "events" | "sort">>;

export type DefaultCalendarType = Pick<CalendarType, "title" | "project_id">;
export type DefaultMonthType = Pick<MonthType, "title" | "parentId" | "days">;
