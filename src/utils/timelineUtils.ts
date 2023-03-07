// import { EventType } from "../types/ItemTypes/calendarTypes";

// export function sortTimelineEvents(a: EventType, b: EventType) {
//   if (a?.year && b?.year) {
//     if (a.year > b.year) return 1;
//     if (a.year < b.year) return -1;
//     return 0;
//   }
// }

export const TimelineGroupingOptions = ["Off", "On"];

export const TimelineViewOptions = [
  { label: "Vertical", value: "Vertical", isDisabled: true },
  { label: "Horizontal", value: "Horizontal", isDisabled: true },
  { label: "Grouped", value: "Grouped" },
];
