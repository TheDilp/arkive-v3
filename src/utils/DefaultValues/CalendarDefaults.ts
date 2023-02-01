import { DefaultCalendarType, DefaultEventType, DefaultMonthType } from "../../types/ItemTypes/calendarTypes";

export const DefaultCalendar: DefaultCalendarType = {
  title: "",
  project_id: "",
};
export const DefaultMonth: DefaultMonthType = {
  title: "",
  parentId: "",
  days: 0,
};
export const DefaultEvent: DefaultEventType = {
  title: "",
  calendarsId: "",
  monthsId: "",
};
