import { DefaultCalendarType, DefaultEraType, DefaultEventType, DefaultMonthType } from "../../types/ItemTypes/calendarTypes";

export const DefaultCalendar: DefaultCalendarType = {
  title: "",
  project_id: "",
  offset: 0,
};
export const DefaultEra: DefaultEraType = {
  title: "",
  parentId: "",
  start_year: 0,
  end_year: 0,
};
export const DefaultMonth: DefaultMonthType = {
  title: "",
  parentId: "",
  days: 0,
};
export const DefaultEvent: DefaultEventType = {
  title: "",
  calendarsId: "",
  backgroundColor: "#075985",
  textColor: "#ffffff",
};
