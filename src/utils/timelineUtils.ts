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
  { label: "Vertical", value: "Vertical" },
  { label: "Horizontal", value: "Horizontal" },
  { label: "Grouped", value: "Grouped" },
];
export const TimelineModeOptions = [
  { label: "Simple", value: "Simple" },
  { label: "Detailed", value: "Detailed" },
];
