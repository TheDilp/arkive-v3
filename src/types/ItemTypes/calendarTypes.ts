/* eslint-disable no-use-before-define */
import { BaseItemType, TagType } from "../generalTypes";
import { DocumentType } from "./documentTypes";

export interface CalendarType extends BaseItemType {
  id: string;
  title: string;

  hours?: number;
  minutes?: number;

  parent?: CalendarType;
  eras: EraType[];
  months: MonthType[];
  days: string[];
  events: EventType[];
}

export type EraType = {
  id: string;
  title: string;
  start_year: number;
  end_year: number;
  parentId: string;

  events: EventType[];
};

export type MonthType = {
  id: string;
  title: string;
  days: number;
  sort: number;
  events: EventType[];
  parentId: string;
};

export type EventType = {
  id: string;
  title: string;
  description?: string;

  textColor: string;
  backgroundColor: string;

  documentsId?: string;
  document?: DocumentType;

  year: number;
  era?: EraType;
  month: MonthType;
  day: number;
  hours?: number;
  minutes?: number;

  isPublic: boolean;

  erasId: string;
  monthsId: string | null;
  calendarsId: string | null;

  tags: TagType[];
};

export type CalendarCreateType = Partial<Omit<CalendarType, "parentId">>;
export type EraCreateType = Partial<Omit<EraType, "events">>;
export type MonthCreateType = Partial<Omit<MonthType, "events" | "sort">>;
export type EventCreateType = Partial<Omit<EventType, "era">>;

export type DefaultCalendarType = Pick<CalendarType, "id" | "title" | "project_id" | "tags">;
export type DefaultEraType = Pick<EraType, "title" | "parentId" | "start_year" | "end_year">;
export type DefaultMonthType = Pick<MonthType, "title" | "parentId" | "days">;
export type DefaultEventType = Pick<EventType, "title" | "calendarsId" | "backgroundColor" | "textColor">;
