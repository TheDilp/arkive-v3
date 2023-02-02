import { EventType } from "../types/ItemTypes/calendarTypes";

export function sortEvents(a: EventType, b: EventType) {
  if (a?.hours && b?.hours) {
    if (a.hours > b.hours) return 1;
    if (a.hours < b.hours) return -1;
    if (a.hours === b.hours) {
      if (a?.minutes && b?.minutes) {
        if (a.minutes > b.minutes) return 1;
        if (a.minutes < b.minutes) return -1;
        return 0;
      }
    }
  }
  return 0;
}
